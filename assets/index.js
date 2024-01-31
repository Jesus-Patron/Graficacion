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

function lineaPendiente(x1, y1, x2, y2) {
  let m = (y2 - y1) / (x2 - x1); // Calcula la pendiente
  let b = y1 - m * x1; // Calcula el término de intersección

  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    let y = m * x + b; // Calcula y usando la ecuación de la línea
    dibujar(x, y); // Dibuja el punto (x, y)
  }
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

// Agregar opciones de dibujo y borrado
const drawButton = document.getElementById("draw-button");
drawButton.addEventListener("click", cambiarHerramienta);

const drawLineButton = document.getElementById("draw-line-pendient-button");
drawLineButton.addEventListener("click", () => {
  // Llama a la función para dibujar la línea con coordenadas específicas
  // Puedes ajustar las coordenadas según sea necesario
  lineaPendiente(100, 100, 300, 300); // Por ejemplo, dibuja una línea de (100, 100) a (300, 300)
});


const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", cambiarBorrador);

const lineWidthInput = document.getElementById("line-width");
lineWidthInput.addEventListener("input", (e) => actualizarAnchoLinea(e.target.value));

const colorPicker = document.getElementById("color-picker");
colorPicker.addEventListener("input", (e) => actualizarColor(e.target.value));