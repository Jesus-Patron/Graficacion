const mainCanvas = document.getElementById("main-canvas");
const context = mainCanvas.getContext("2d");

let initialX;
let initialY;
let correccionX = 0;
let correccionY = 0;
let isDrawing = false;
let isErasing = false;
let lineWidth = 5;
let strokeColor = "#000";

let startX, startY, endX, endY;
let activometobasico = false;  
let activobresenham = false;
let activocuadrado = false;
let activoDDA = false;
let activocirculo = false;

let posicion = mainCanvas.getBoundingClientRect();
correccionX = posicion.x;
correccionY = posicion.y;

function dibujar(cursorX, cursorY) {
  context.beginPath();
  context.moveTo(initialX, initialY);
  context.lineWidth = lineWidth;
  context.strokeStyle = isErasing ? "#fff" : strokeColor;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineTo(cursorX, cursorY);
  context.stroke();

  initialX = cursorX;
  initialY = cursorY;
}

const cambiarHerramienta = (evt) => {
  isDrawing = !isDrawing;
  isErasing = false;
  mainCanvas.style.cursor = isDrawing ? "crosshair" : "default";
};

const cambiarBorrador = () => {
  isErasing = !isErasing;
  isDrawing = false;
  mainCanvas.style.cursor = isErasing ? "url('eraser.png'), auto" : "crosshair";
};

const actualizarAnchoLinea = (valor) => {
  lineWidth = valor;
};

const actualizarColor = (color) => {
  strokeColor = color;
};

const mouseDown = (evt) => {
  evt.preventDefault();
  if (evt.changedTouches === undefined) {
    initialX = evt.offsetX;
    initialY = evt.offsetY;
  } else {
    initialX = evt.changedTouches[0].pageX - correccionX;
    initialY = evt.changedTouches[0].pageY - correccionY;
  }

  if (isDrawing || isErasing) {
    dibujar(initialX, initialY);
    mainCanvas.addEventListener("mousemove", mouseMoving);
    mainCanvas.addEventListener("touchmove", mouseMoving);
  }
};

const mouseMoving = (evt) => {
  evt.preventDefault();
  if (evt.changedTouches === undefined) {
    dibujar(evt.offsetX, evt.offsetY);
  } else {
    dibujar(evt.changedTouches[0].pageX - correccionX, evt.changedTouches[0].pageY - correccionY);
  }
};

const mouseUp = () => {
  mainCanvas.removeEventListener("mousemove", mouseMoving);
  mainCanvas.removeEventListener("touchmove", mouseMoving);
};

mainCanvas.addEventListener("mousedown", mouseDown);
mainCanvas.addEventListener("mouseup", mouseUp);

// Pantallas táctiles
mainCanvas.addEventListener("touchstart", mouseDown);
mainCanvas.addEventListener("touchend", mouseUp);

mainCanvas.addEventListener('mousedown', (event) => {
  if (!activometobasico && !activobresenham && !activoDDA && !activocuadrado && !circulo) return;
  isDrawing = true;
  startX = event.offsetX;
  startY = event.offsetY;
});
mainCanvas.addEventListener('mousemove', (event) => {
  //if (!activometobasico || !isDrawing) return;
  //if (!isDrawing) return;
  endX = event.offsetX;
  endY = event.offsetY;
});
mainCanvas.addEventListener('mouseup', () => {
  if (!isDrawing) return;
  isDrawing = false;// Se desactiva la bandera de dibujo al soltar el botón del mouse
  if (activometobasico) {
    drawLinemetbasico(startX, startY, endX, endY);
  } else if (activobresenham) {
    drawLineBresenham(startX, startY, endX, endY);
  }else if (activoDDA) {
    drawLineDDA(startX, startY, endX, endY);
  }else if (activocuadrado) {
    drawcuadrado(startX, startY, endX, endY);
  }else if (activocirculo) {
    drawcirculo(startX, startY, endX, endY);
  }
});

//Algoritmo de pendiente ordenado al origen
function drawLinemetbasico(x1, y1, x2, y2) {
  const m = (y2 - y1) / (x2 - x1); // Pendiente
  const b = y1 - m * x1; // Intersección con el eje y

  context.beginPath();
  context.moveTo(x1, y1);

  if (x2 !== x1) {
    for (let x = x1 + 1; x <= x2; x++) {
      const y = m * x + b;
      context.lineTo(x, y);
    }
  } else { // Caso especial para una línea vertical
    const step = (y2 > y1) ? 1 : -1;
    for (let y = y1 + step; y !== y2; y += step) {
      context.lineTo(x1, y);
    }
  }

  context.lineTo(x2, y2);
  context.stroke();
}

//Algoritmo de bresenham
function drawLineBresenham(x1, y1, x2, y2) {
 //calcula las diferencias en x e y
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  //Determina la direccion de incremento/decremento en x e y
  let sx = (x1 < x2) ? 1 : -1;
  let sy = (y1 < y2) ? 1 : -1;

  //inicializa err,que se utiliza en el algoritmo
  let err = dx - dy;

  while (true) {
    context.fillRect(x1, y1, 1, 1);
    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err;
    //Actualiza err y las coordenadas segun la condicion
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

//Algoritmo DDA
function drawLineDDA(x1, y1, x2, y2){
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  let x = x1;
  let y = y1;

  context.beginPath();
  context.moveTo(x, y);

  for (let i = 0; i < steps; i++) {
    x += xIncrement;
    y += yIncrement;
    context.lineTo(Math.round(x), Math.round(y));
  }

  context.lineTo(x2, y2);
  context.stroke();
}

//Algoritmo de cuadrado
function drawcuadrado(x1, y1, x2, y2){
  var width = Math.abs(x2 - x1);
  var height = Math.abs(y2 - y1); 

  const size = Math.min(width, height);

  var cuadradoinicio = {
    x: (x1 < x2) ? x1 : x2,
    y: (y1 < y2) ? y1 : y2
  };

  var cuadradofin = {
    x: cuadradoinicio.x + size,
    y: cuadradoinicio.y + size
};
drawLineDDA(cuadradoinicio.x, cuadradoinicio.y, cuadradofin.x, cuadradoinicio.y);
drawLineDDA(cuadradofin.x, cuadradoinicio.y, cuadradofin.x, cuadradofin.y);
drawLineDDA(cuadradofin.x, cuadradofin.y, cuadradoinicio.x, cuadradofin.y);
drawLineDDA(cuadradoinicio.x, cuadradofin.y, cuadradoinicio.x, cuadradoinicio.y);
}

//Algoritmo de circulo
function drawcirculo(x1, x2, y1, y2){
  let centerX, centerY;
  let radius;
 // Calcula el centro del círculo
 centerX = (x1 + x2) / 2;
 centerY = (y1 + y2) / 2;

 // Calcula el radio del círculo
 radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;

 // Dibuja el círculo
 context.beginPath();
 context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
 context.stroke();
}

// Agregar opciones de dibujo y borrado
const drawButton = document.getElementById("draw-button");
drawButton.addEventListener("click", cambiarHerramienta);

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", cambiarBorrador);

const lineWidthInput = document.getElementById("line-width");
lineWidthInput.addEventListener("input", (e) => actualizarAnchoLinea(e.target.value));

const colorPicker = document.getElementById("color-picker");
colorPicker.addEventListener("input", (e) => actualizarColor(e.target.value));

function lineametodobasico() {
  activometobasico = true;
  activobresenham = false
  activocuadrado = false;
  activoDDA = false;
  activocirculo = false;
}

function lineabresenham(){
  activobresenham = true;
  activometobasico = false;
  activocuadrado = false;
  activoDDA = false;
  activocirculo = false;
}

function lineaDDA() {
  activoDDA = true;
  activometobasico = false;
  activobresenham = false;
  activocuadrado = false;
  activocirculo = false;
}

function cuadrado(){
  activocuadrado = true;
  activometobasico = false;
  activobresenham = false;
  activoDDA = false;
  activocirculo = false;
}

function circulo(){
  activocirculo = true;
  activocuadrado = false;
  activometobasico = false;
  activobresenham = false;
  activoDDA = false;
}