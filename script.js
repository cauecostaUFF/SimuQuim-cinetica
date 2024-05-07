const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// Imagens
function desenhandoFundo(){
    let imagem = new Image();
    imagem.src = "Figuras/Fundo0.png"
    ctx.drawImage(imagem,0,0,canvas.width,canvas.height)
}

var colisãoButton = {
    x: 285,
    y: 150,
    width: 150,
    height: 50,
};
function desenhandoColisão(){
    let imagem = new Image();
    imagem.src = "Figuras/Sm.png"
    ctx.drawImage(imagem,285,150,150,50)
}

var reaçãoButton = {
    x: 285,
    y: 220,
    width: 150,
    height: 50,
};
function desenhandoReação(){
    let imagem = new Image();
    imagem.src = "Figuras/Sec.png"
    ctx.drawImage(imagem,285,220,150,50)
}

var créditoButton = {
    x: 285,
    y: 290,
    width: 150,
    height: 50,
};
function desenhandoCrédito(){
    let imagem = new Image();
    imagem.src = "Figuras/Credito.png"
    ctx.drawImage(imagem,285,290,150,50)
}

const interval = setInterval(draw, 20);
function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    desenhandoFundo();
    desenhandoColisão();
    desenhandoReação();
    desenhandoCrédito();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

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
    
      if (isInside(mousePos, colisãoButton)) {
        window.location.href = 'index3.html';
        return false;
      }
      if (isInside(mousePos, reaçãoButton)) {
        window.location.href = 'index2.html';
        return false;
      }
      if (isInside(mousePos, créditoButton)) {
        openModal();
        }
    });

const modal = document.querySelector('.modal-container')
function openModal() {
    modal.classList.add('active')
}
  
function closeModal() {
    modal.classList.remove('active')
}