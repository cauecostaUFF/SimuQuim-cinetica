// Classe de vetores
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
let piston = 0;
let cont = 0;
let x = ballRadius;
let y = canvas.height - ballRadius;
let B = [];
let vel = 0;
const imagem = document.getElementById("fig")


// Desativando o botão decreaseP
document.getElementById("decreaseP").disabled = true

// Criando bolas verdes
document.getElementById("newBallA").addEventListener("click", function () {
    newBall("green");
});

// Criando bolas azuis
document.getElementById("newBallB").addEventListener("click", function () {
    newBall("blue");
});

// Resetando estado
document.getElementById("reset").addEventListener("click", function () {
    B = []; cont = 0; vel = 0;piston = 0;

    document.getElementById("increaseT").disabled = false;
    document.getElementById("decreaseT").disabled = false;
    document.getElementById("increaseP").disabled = false;
    document.getElementById("decreaseP").disabled = true;
});

// Aumentando a velocidade das esferas
document.getElementById("increaseT").addEventListener("click", function () {
    vel += 5; document.getElementById("decreaseT").disabled = false;
    document.getElementById("decreaseTFig").src= "Figuras/queda_temp.png"
    if (vel<25){
       for (let i = 0;i<B.length;i++){
            B[i].changeVel(vel);
        }
    }else {
        document.getElementById("increaseT").disabled = true;
        document.getElementById("increaseTFig").src= "Figuras/aumento_temp(transp).png"
    }
});

// Diminuindo a velocidade das esferas
document.getElementById("decreaseT").addEventListener("click", function () {
    vel -= 5; document.getElementById("increaseT").disabled = false;
    document.getElementById("increaseTFig").src= "Figuras/aumento_temp.png"
    if (vel>-20){
            for (let i = 0;i<B.length;i++){
            B[i].changeVel(vel);
        }
    } else {
        document.getElementById("decreaseT").disabled = true;
        document.getElementById("decreaseTFig").src= "Figuras/queda_temp(transp).png"
    }
});

// Aumentando a pressão através da diminuição do volume
document.getElementById("increaseP").addEventListener("click", function () {
    document.getElementById("decreaseP").disabled = false;
    document.getElementById("decreasePFig").src= "Figuras/queda_pressão.png"
    piston += 50;
    if (piston>=400){
        document.getElementById("increaseP").disabled = true;
        document.getElementById("increasePFig").src= "Figuras/aumento_pressão(transp).png"
    }
    for (let i = 0;i<B.length;i++){
        if (B[i].pos.y + B[i].vel.y  < 1.25*ballRadius+piston) {
            B[i].pos.y=1.25*ballRadius+piston;
        }
    }
});

// Diminuindo a pressão através do aumento do volume
document.getElementById("decreaseP").addEventListener("click", function () {
    document.getElementById("increaseP").disabled = false;
    document.getElementById("increasePFig").src= "Figuras/aumento_pressão.png"
    for (let i = 0; i<50;i++){
        piston -= 1;
    }
    if (piston<=0){
        document.getElementById("decreaseP").disabled = true;
        document.getElementById("decreasePFig").src= "Figuras/queda_pressão(transp).png"
    }
});

// Rodando as bolinhas
const interval = setInterval(draw, 20);

// Criando novas bolinhas
function newBall(col){
    B[cont] = new Ball(50,canvas.height-50,ballRadius,-(Math.random()*5 - 5)*(1+vel/25) ,(Math.random()*5 - 5)*(1+vel/25),col);
    cont +=1;
}
// Desenhando tudo 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenhandoFundo();
    //desenhandoPistão();
    ctx.beginPath();
    let p = ctx.rect(35,piston-20,canvas.width-55,25);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();


    for (let i = 0; i<B.length; i++){
        //Colisões com as paredes
        if (B[i].pos.x + B[i].vel.x > canvas.width - (ballRadius+15)) {
            B[i].vel.x=-Math.abs(B[i].vel.x);B[i].orig_vel.x=-Math.abs(B[i].orig_vel.x);
            B[i].pos.x=canvas.width - (ballRadius+15);
        }
        if (B[i].pos.x + B[i].vel.x  < (ballRadius+32)){
            B[i].vel.x=Math.abs(B[i].vel.x);B[i].orig_vel.x=Math.abs(B[i].orig_vel.x);
            B[i].pos.x=(ballRadius+32);
        }

        //Colisões com o pistão e fundo
        if (B[i].pos.y + B[i].vel.y > canvas.height - (ballRadius+5)) {
            B[i].vel.y=-Math.abs(B[i].vel.y);B[i].orig_vel.y=-Math.abs(B[i].orig_vel.y);
            B[i].pos.y=canvas.height - (ballRadius+5);
        }
        if (B[i].pos.y + B[i].vel.y  < (ballRadius+5)+piston) {
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
        if (Math.random()>0.90-(vel/50) && ((b1.color=="blue" && b2.color=="green")|| (b1.color=="green" && b2.color=="blue"))){
            b1.status = false;
            b1.r = 0;
            b2.color = "orange";
            b2.r = 15;
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

function desenhandoFundo(){
    let imagem = new Image();
    imagem.src = "Figuras/Fundo.jpg"
    ctx.drawImage(imagem,0,0,canvas.width,canvas.height)
}
/*function desenhandoPistão(){
    let imagem = new Image();
    imagem.src = "Figuras/pistão.png"
    ctx.drawImage(imagem,0,0,canvas.widht,canvas.heigth)
}*/
    
