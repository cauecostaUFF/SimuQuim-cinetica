class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }

    subtr(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }

    mag(){
        return Math.sqrt(this.x**2 + this.y**2);
    }

    mult(n){
        return new Vector(this.x*n, this.y*n);
    }

    normal(){
        return new Vector(-this.y, this.x).unit();
    }

    unit(){
        if(this.mag() === 0){
            return new Vector(0,0);
        } else {
            return new Vector(this.x/this.mag(), this.y/this.mag());
        }
    }
    
}

// Construção da classe Ball
class Ball{
    constructor(x,y,r,vx,vy,color){
        this.pos = new Vector(x,y);
        this.vel = new Vector(vx,vy);
        this.r = r;
        this.orig_vel = new Vector(vx,vy)
        this.color = color;
        this.status = true;
        if (this.status){
            this.drawBall()
        }
        
    }
    drawBall() {
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    changeVel(vel){
        this.vel.x = this.orig_vel.x*(1+vel/25)
        this.vel.y = this.orig_vel.y*(1+vel/25)
    }
}

// Definições de variáveis
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let B = [];
let path_graph = "Figuras/Gráfico.png"
let path_botão = "Figuras/1.png"
let reação = false;
let altura = 0;
let sinal = 1;
let isBangSelected=false;
let velocidade =  document.querySelector('input[name="veloc"]:checked').value;


// Bola inicial
function iniciar(){
    B[0] = new Ball(600,200,15,0 ,0,"red");
    path_graph = "Figuras/Gráfico.png"
    reação = false;
    altura = 0;
    sinal = 1;
    path_botão = "Figuras/1.png"
    isBangSelected=false;
}
iniciar();

const interval = setInterval(draw, 20);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (altura>=0 & altura<=135){
        altura +=velocidade*sinal;
    } 
    if (altura<=0){
        sinal *=-1; altura = 0;
    } else if (altura >= 135){
        sinal *=-1; altura = 135;
    }

    desenhandoFundo();
    desenhandoCanhão();
    desenhandoGráfico();
    desenhandoStrike();
    desenhandoReset();
    desenhandoBotão();
    desenhandoMenu();
    desenhandoVoltar();
    if (reação){
        desenhandoReação();
    }    
    ctx.beginPath();
    let p = ctx.rect(64,270+altura,36,5);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    for (let i = 0; i<B.length; i++){
        //Colisões com as paredes
        if (B[i].pos.x + B[i].vel.x > canvas.width - (ballRadius+15)) {
            B[i].vel.x=-Math.abs(B[i].vel.x);B[i].orig_vel.x=-Math.abs(B[i].orig_vel.x);
            B[i].pos.x=canvas.width - (ballRadius+15);
        }
        if (B[i].pos.x + B[i].vel.x  < (ballRadius+420)){
            B[i].vel.x=Math.abs(B[i].vel.x);B[i].orig_vel.x=Math.abs(B[i].orig_vel.x);
            B[i].pos.x=(ballRadius+420);
        }

        //Colisões com o fundo 
        if (B[i].pos.y + B[i].vel.y > canvas.height - (ballRadius+200)) {
            B[i].vel.y=-Math.abs(B[i].vel.y);B[i].orig_vel.y=-Math.abs(B[i].orig_vel.y);
            B[i].pos.y=canvas.height - (ballRadius+200);
        }
        //Colisões com o topo
        if (B[i].pos.y + B[i].vel.y  < (ballRadius+5)) {
            B[i].vel.y=Math.abs(B[i].vel.y);B[i].orig_vel.y=Math.abs(B[i].orig_vel.y);
            B[i].pos.y=piston+(ballRadius+5);
        }

        B[i].pos.x += B[i].vel.x;   
        B[i].pos.y += B[i].vel.y;
        if (B[i].status){
            B[i].drawBall()
    

            for(let ii = i+1; ii<B.length; ii++){
                if(detecta_colisão(B[i], B[ii])){
                    resultante(B[i], B[ii]);
                }
            }
        }
    }
}

function detecta_colisão(b1, b2){
    if(b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()){
        if (altura>45 & altura<90){
            path_graph = "Figuras/Gráfico3.png"
            b1.color = "orange";
            b1.r = 20;
            b1.vel.x = b2.vel.x;
            b1.vel.y = b2.vel.y;
            b2.r = 0;
            b2.status = false;
            B[1] = [];
            reação = true;
        } else if (altura<22.5| altura>112.5){
            path_graph = "Figuras/Gráfico1.png"
        } else {
            path_graph = "Figuras/Gráfico2.png"
        }
        
        return true;
    
    } else {
        return false;
    }
}

function resultante(b1, b2){
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth/2);
    b1.pos = b1.pos.add(pen_res);
    b2.pos = b2.pos.add(pen_res.mult(-1));
    let velx = b1.vel.x;
    let vely = b1.vel.y;
    b1.vel.x = (b1.r-b2.r)/(b1.r+b2.r)*b1.vel.x + (2*b2.r)/(b1.r+b2.r)*b2.vel.x;
    b1.vel.y = (b1.r-b2.r)/(b1.r+b2.r)*b1.vel.y + (2*b2.r)/(b1.r+b2.r)*b2.vel.y;
    b2.vel.x = (2*b1.r)/(b1.r+b2.r)*velx + (b2.r-b1.r)/(b1.r+b2.r)*b2.vel.x;
    b2.vel.y = (2*b1.r)/(b1.r+b2.r)*vely + (b2.r-b1.r)/(b1.r+b2.r)*b2.vel.x;
}

// Desenhando
function desenhandoFundo(){
    let imagem = new Image();
    imagem.src = "Figuras/Fundo2.png"
    ctx.drawImage(imagem,0,0,canvas.width,canvas.height)
}
function desenhandoCanhão(){
    let imagem = new Image();
    imagem.src = "Figuras/Cannon.png"
    ctx.drawImage(imagem,280,canvas.height-250,150,100)
}

function desenhandoGráfico(){
    let imagem = new Image();
    imagem.src = path_graph
    ctx.drawImage(imagem,175,45,225,150)
}

function desenhandoReação(){
    let imagem = new Image();
    imagem.src = "Figuras/Reação2.png"
    ctx.drawImage(imagem,450,300,225,75)
}

function desenhandoStrike(){
    let imagem = new Image();
    imagem.src = "Figuras/Strike.png"
    ctx.drawImage(imagem,50,245,65,200)
}
var resetButton = {
    x: 65,
    y: 120,
    width: 45,
    height: 45,
};
function desenhandoReset(){
    let imagemReset = new Image();
    imagemReset.src = "Figuras/Restart.png"
    ctx.drawImage(imagemReset,65,120,45,45)
}

var menuButton = {
    x: 65,
    y: 50,
    width: 45,
    height: 45,
};
function desenhandoMenu(){
    let imagemReset = new Image();
    imagemReset.src = "Figuras/Menu.png"
    ctx.drawImage(imagemReset,65,50,45,45)
}

var quitButton = {
    x: 620,
    y: 410,
    width: 45,
    height: 45,
};
function desenhandoVoltar(){
    let imagemReset = new Image();
    imagemReset.src = "Figuras/Quit.png"
    ctx.drawImage(imagemReset,620,410,45,45)
}
var bangButton = {
    x: 150,
    y: 400,
    width: 125,
    height: 35,
};
function desenhandoBotão(){
    let imagem = new Image();
    imagem.src = path_botão;
    ctx.drawImage(imagem,150,400,125,35)
}


// Botões no canvas
function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Function to check whether a point is inside a rectangle
function isInside(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}

// The rectangle should have x,y,width,height properties
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
  
    if (isInside(mousePos, resetButton)) {
        B[1] = [];
        iniciar();
    } 
    if (isInside(mousePos, bangButton)&& isBangSelected==false){
        B[1] = new Ball(420,290,10,8,-4,"yellow");
        sinal = 0;
        path_botão = "Figuras/2.png"
        isBangSelected = true;
    }
    if (isInside(mousePos, menuButton)){
        openModal()
    }
    if (isInside(mousePos, quitButton)){
        window.location.href = 'index.html';
    }
  }, false);


// Modal
const modal = document.querySelector('.modal-container')
function openModal() {
    modal.classList.add('active')
}
  
function closeModal() {
    velocidade = document.querySelector('input[name="veloc"]:checked').value
    modal.classList.remove('active')
}
 

  