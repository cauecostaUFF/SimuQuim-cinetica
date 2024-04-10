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

    drawVec(start_x, start_y, n, color){
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }
    
    static dot(v1, v2){
        return v1.x*v2.x + v1.y*v2.y;
    }
}

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

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let piston = 0;


let cont = 0;
let x = ballRadius;
let y = canvas.height - ballRadius;
let B = [];

let vel = 0;
let scroll = document.getElementById("scroll")
document.getElementById("decreaseP").disabled = true

document.getElementById("newBallA").addEventListener("click", function () {
    newBall("green");
});
document.getElementById("newBallB").addEventListener("click", function () {
    newBall("blue");
});
document.getElementById("reset").addEventListener("click", function () {
    B = []; cont = 0; vel = 0;piston = 0;

    document.getElementById("increaseT").disabled = false;
    document.getElementById("decreaseT").disabled = false;
    document.getElementById("increaseP").disabled = false;
    document.getElementById("decreaseP").disabled = true;
});
document.getElementById("increaseT").addEventListener("click", function () {
    vel += 5; document.getElementById("decreaseT").disabled = false;
    if (vel<25){
       for (let i = 0;i<B.length;i++){
            B[i].changeVel(vel);
        }
    }else {
        document.getElementById("increaseT").disabled = true;
    }
});
document.getElementById("decreaseT").addEventListener("click", function () {
    vel -= 5; document.getElementById("increaseT").disabled = false;
    if (vel>-20){
            for (let i = 0;i<B.length;i++){
            B[i].changeVel(vel);
        }
    } else {
        document.getElementById("decreaseT").disabled = true;
    }
});
document.getElementById("increaseP").addEventListener("click", function () {
    document.getElementById("decreaseP").disabled = false;
    piston += 50;
    if (piston>=450){
        document.getElementById("increaseP").disabled = true;
    }
    for (let i = 0;i<B.length;i++){
        
    }
});

document.getElementById("decreaseP").addEventListener("click", function () {
    document.getElementById("increaseP").disabled = false;
    piston -= 50;
    if (piston<=0){
        document.getElementById("decreaseP").disabled = true;
    }
});

const interval = setInterval(draw, 10);


function newBall(col){
    B[cont] = new Ball(x,y,ballRadius,(Math.random()*10 - 5)*(1+vel/25) ,(Math.random()*10 - 5)*(1+vel/25),col);
    cont +=1;
}


function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    let p = ctx.rect(0,piston,1000,5);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();


    for (let i = 0; i<B.length; i++){

        if (B[i].pos.x + B[i].vel.x > canvas.width - ballRadius || B[i].pos.x + B[i].vel.x  < ballRadius) {
            B[i].vel.x*=-1 ;B[i].orig_vel.x*=-1;
        }
        
        if (B[i].pos.y + B[i].vel.y > canvas.height - ballRadius || B[i].pos.y + B[i].vel.y  < ballRadius+piston) {
            B[i].vel.y*=-1 ;B[i].orig_vel.y*=-1;
        }

        B[i].pos.x += B[i].vel.x;
        B[i].pos.y += B[i].vel.y;
        if (B[i].status){
            B[i].drawBall()
        
            for(let ii = i+1; ii<B.length; ii++){
                if(coll_det_bb(B[i], B[ii])){
                    pen_res_bb(B[i], B[ii]);
                    //B[ii].color = 'red';
                }
            }
        }
    }

}



function coll_det_bb(b1, b2){
    if(b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()){
        if (Math.random()>0.95-(vel/50) && ((b1.color=="blue" && b2.color=="green")|| (b1.color=="green" && b2.color=="blue"))){
            b1.status = false;
            b1.r = 0;
            b2.color = "red";
            b2.r = 15;
        }
        return true;
    
    } else {
        return false;
    }
}

function pen_res_bb(b1, b2){
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth/2);
    b1.pos = b1.pos.add(pen_res);
    b2.pos = b2.pos.add(pen_res.mult(-1));
}
