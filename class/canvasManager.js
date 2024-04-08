import {Figura} from "../class/figuras.js";
import {Linea} from "../class/linea.js";
import {Cuadrado} from "../class/cuadrado.js";
import {Circulo} from "../class/circulo.js";
import {Poligonos} from "../class/poligonos.js";   
import {Elipse} from "../class/elipse.js";
import {HistoryManager} from "../class/historyManager.js"
import { Trapecio } from "./trapecio.js";
import { Rectangulo } from "./rectangulo.js";
import { Texto } from "./texto.js";

class CanvasManager {
    constructor() {
        // Obtener contextos de las capas
        this.layer1Ctx = document.getElementById("layer1Canvas").getContext("2d", { willReadFrequently: true });
        this.layer2Ctx = document.getElementById("layer2Canvas").getContext("2d", { willReadFrequently: true });

        // Otras propiedades y configuraciones necesarias
        this.modo = "";
        this.color = "#000000";
        this.grosor = 1;
        this.drawing = false;
        this.gridEnabled = false;
        this.startPoint = null;
        this.endPoint = null;
        this.freePixels = [];
        this.currentCanvas = null;
        this.ladospoligono = 0;
        this.figuraSeleccionada = null;
        this.setupCanvas();
        this.setupListeners();

        this.history = new HistoryManager();
        this.figuras = [];
    }
    setupCanvas() {

        //Tamano de los canvas
        this.layer1Ctx.canvas.width = 1024;
        this.layer1Ctx.canvas.height = 768;
        this.layer2Ctx.canvas.width = 1024;
        this.layer2Ctx.canvas.height = 768;
        // El canvas actual es el layer1 por defecto
        this.setCurrentCanvas("layer2Canvas");

    }
    setupListeners() {
       //MouseDown
        document.addEventListener("mousedown", this.mouseDown);

    }
    setCurrentCanvas(canvasId) {
        // Establece el canvas actual en función del ID proporcionado
        this.currentCanvas = document.getElementById(canvasId);

        // console.log(this.currentCanvas);
    }
    setDrawing(newDrawing) {
        // Establece el estado del dibujo
        this.drawing = newDrawing;
    }
    setGridEnabled(newGridEnabled) {
        // Establece el estado del grid
        console.log(newGridEnabled);
        this.gridEnabled = newGridEnabled;
    }
    setLadosPoligono(newLados){
        this.ladospoligono = newLados;
        console.log(this.ladospoligono);
    }
    setModo(newModo){
        this.modo = newModo;
    }
    getCurrentModo(){
        return this.modo;
    }
    getGridEnabled() {
        // Devuelve el estado del grid
        return this.gridEnabled;
    }
    getCurrentCanvas() {
        // Devuelve el canvas actual
        return this.currentCanvas;
    }
    getDrawing() {
        // Devuelve el estado del dibujo
        return this.drawing;
    }
    getRelativeCoordinates(event) {
        // Obtiene las coordenadas relativas del evento en el canvas actual
    
        const rect = this.getCurrentCanvasContext().canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        // console.log(rect);

    }
    getCurrentCanvasContext() {
        //Obtener el context del canvas actual
        return this.currentCanvas.getContext("2d");
    }
    getCurrentLadospoligono(){
        return this.ladospoligono;
    }
    cambiarModo(newModo) {
        this.modo = newModo;
        console.log(this.modo);
        // Otras acciones relacionadas con cambiar el modo
    }
    cambiarColor(newColor) {
        this.color = newColor;
        console.log(this.color + " color");
        // Configurar el color cada vez que cambias el color
        // ...
    }
    cambiarGrosor(newGrosor) {
        this.grosor = newGrosor;
        console.log(this.grosor);
        // Configurar el grosor cada vez que cambias el grosor
        // ...
    }
    activarGrid() {
        this.gridEnabled = !this.gridEnabled;
        this.drawGrid();
        console.log(this.gridEnabled);
        // Otras acciones relacionadas con activar o desactivar el grid
    }
    drawGrid() {
        // Implementar lógica para dibujar el grid
        // ...
    }
    drawLine(start, end) {
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        // Crear una instancia de la clase Linea (o tu clase correspondiente)
        const linea = new Linea(ctx, this.color, this.grosor, start, end);
        // Llamar al método draw de la instancia Linea
        linea.draw(start, end);
        return linea;
    }
    drawSquare(start, end) {

        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        // Crear una instancia de la clase Linea (o tu clase correspondiente)
        const cuadrado = new Cuadrado(ctx, this.color, this.grosor, start, end);
        // Llamar al método draw de la instancia Linea
        cuadrado.draw();
        return cuadrado;
    }
    drawText(start, end) {
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        // Crear una instancia de la clase Linea (o tu clase correspondiente)
        const texto = new Texto(ctx, this.color, this.grosor, start, end);
        // Llamar al método draw de la instancia Linea
        texto.draw();
        return texto;
    }
    drawRectangle(start, end) {

        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        // Crear una instancia de la clase Linea (o tu clase correspondiente)
        const rectangulo = new Rectangulo(ctx, this.color, this.grosor, start, end);
        // Llamar al método draw de la instancia Linea
        rectangulo.draw();
        return rectangulo;
    }
    drawCircle(start,end){
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        const circulo = new Circulo(ctx, this.color, this.grosor, start, end);
        circulo.draw();
        return circulo;
    }
    drawPolygon(start,end){
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        const line = this.getCurrentLadospoligono();
        // console.log(ctx, this.color, this.grosor, start, end, line)
        const poligonos = new Poligonos(ctx, this.color, this.grosor, start, end, line);
        poligonos.draw();
        return poligonos;
    }
    drawElips(start,end){
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        const elipse = new Elipse(ctx, this.color, this.grosor, start, end);
        elipse.draw();
        return elipse;
    }
    drawPixel(start,end,) {
       //Dibujo libre, pintar pixel por pixel
        const ctx = this.getCurrentCanvasContext();
        let line = new Linea(ctx, this.color, this.grosor, start, end);
        let puntosLinea = line.draw(start, end);
        //Sumarle al arreglo de puntos los puntos de la linea
        this.freePixels = this.freePixels.concat(puntosLinea);
        
    }
    // erasePixel(start,end){
    //     //Borrar pixel por pixel
    //     const ctx = this.getCurrentCanvasContext();
    //     let line = new Linea(ctx, "#FFFFFF", this.grosor, start, end);
    //     let puntosLinea = line.draw(start, end);
    //     //Sumarle al arreglo de puntos los puntos de la linea
    //     this.freePixels = this.freePixels.concat(puntosLinea);
    // }

    drawTrapecio(start,end){
        const ctx = this.getCurrentCanvasContext();
        const trapecio = new Trapecio(ctx, this.color, this.grosor, start, end);
        trapecio.draw();
        return trapecio;
    }
    cleanLine(start, end) {
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        // Crear una instancia de la clase Linea (o tu clase correspondiente)
        const linea = new Linea(ctx, this.color, this.grosor, start, end);
        // Llamar al método draw de la instancia Linea
        linea.cleanLine(start, end);
    }
    fillCubeta(start) {
        console.log("Rellenando");
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        const targetColor = null
        //Recorrer el arreglo de figuras desde el ultimo agregado hacia atras para ver si pertenece a esa figura utilizando el isinside
        let figuraSeleccionada = this.history.seleccionarFigura(ctx,start);
        if (figuraSeleccionada){
            console.log("Figura seleccionada", figuraSeleccionada);
            figuraSeleccionada.rellenar(ctx,targetColor,this.color)
        }
        else {
            console.log("No hay figura seleccionada")
            console.log(start.x, start.y)

        }
        this.history.renderizar(ctx);
    }  
    floodFill(ctx,startX, startY, targetColor, fillColor) {
        if (targetColor.toString() === fillColor.toString()) {
            console.log("El pixel de inicio ya es del color de relleno deseado.");
            return;
        }
    
        var stack = [[startX, startY]];
        var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        var pixels = imageData.data;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        var getColorIndex = function(x, y) {
            return (y * width + x) * 4;
        };

        var isSameColor = function(pixelPos) {
            return (
                pixels[pixelPos] === targetColor[0] &&
                pixels[pixelPos + 1] === targetColor[1] &&
                pixels[pixelPos + 2] === targetColor[2] &&
                pixels[pixelPos + 3] === targetColor[3]
            );
        };

        var setColor = function(pixelPos) {
            pixels[pixelPos] = fillColor[0];
            pixels[pixelPos + 1] = fillColor[1];
            pixels[pixelPos + 2] = fillColor[2];
            pixels[pixelPos + 3] = fillColor[3];
        };

        while (stack.length) {
            var newPos, x, y, pixelPos, reachLeft, reachRight;

            newPos = stack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = getColorIndex(x, y);

            while (y-- >= 0 && isSameColor(pixelPos)) {
                pixelPos -= width * 4;
            }
            pixelPos += width * 4;

            reachLeft = false;
            reachRight = false;

            while (y++ < height - 1 && isSameColor(pixelPos)) {
                setColor(pixelPos);

                if (x > 0) {
                    if (isSameColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            stack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < width - 1) {
                    if (isSameColor(pixelPos + 4)) {
                        if (!reachRight) {
                            stack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += width * 4;
            }
        }
        this.history.addActionToHistory(imageData, "fill");
        ctx.putImageData(imageData, 0, 0);
    }
    hexToRgb(hex) {
        //Recibe un color en formato hexadecimal y lo convierte a RGB
        //Ejemplo: #FFFFFF -> [255, 255, 255, 255]
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            255
        ] : null;
    }
    drawPreview(start, end) {
        // Obtener el contexto del canvas actual
        this.setCurrentCanvas("layer2Canvas");  
        const ctx = this.getCurrentCanvasContext();
        // // Limpiar el canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Dibujar la figura correspondiente
        if (this.modo === "linea") {
            this.drawLine(start, end);
        } else if (this.modo === "cuadrado") {
            this.drawSquare(start, end);
        } else if (this.modo === "texto") {
            this.drawRectangle(start, end);
        } else if (this.modo === "rectangulo") {
            this.drawRectangle(start, end);
        } else if (this.modo === "circulo") {
            this.drawCircle(start, end);
        } else if (this.modo    === "poligono") {
            this.drawPolygon(start, end);
        } else if (this.modo === "elipse") {
            this.drawElips(start, end);
        }
        else if (this.modo === "trapecio") {
            this.drawTrapecio(start, end);
        }
        else if (this.modo === "lapiz" || this.modo === "pixelEraser") {
           this.drawPixel(start,end);
        }


        // this.history.renderizar(this.getCurrentCanvasContext(),1);

    }   

    draw(start, end) {
        this.setCurrentCanvas("layer1Canvas");
        const ctx = this.getCurrentCanvasContext();

        if (this.modo === "linea") {
            const line = this.drawLine(start, end);
            this.history.addActionToHistory(line, "figure");

        }  else if (this.modo === "pixelEraser") {
              //guardar el dibujo libre en history action, creando una nueva figura
              const F = new Figura(ctx, "#FFFFFF", this.grosor);
              F.puntos = this.freePixels;
              console.log(F);
              this.history.addActionToHistory(F, "figure");
              this.freePixels = [];
        } else if (this.modo === "cuadrado") {
            const square = this.drawSquare(start, end);
            this.history.addActionToHistory(square, "figure");
        } else if (this.modo === "texto") {
            const text = this.drawText(start, end);
            this.history.addActionToHistory(text, "figure");
            
        } else if (this.modo === "rectangulo") {
            const rectangle = this.drawRectangle(start, end);
            this.history.addActionToHistory(rectangle, "figure");
        } else if (this.modo === "circulo") {
            const circle = this.drawCircle(start, end);
            this.history.addActionToHistory(circle, "figure");
        } else if (this.modo === "poligono") {
            const poligonos = this.drawPolygon(start, end);
            this.history.addActionToHistory(poligonos, "figure");

        } else if (this.modo === "elipse") {
            const elipse = this.drawElips(start, end);
            this.history.addActionToHistory(elipse, "figure");
        }
        else if (this.modo === "trapecio") {
            const trapecio = this.drawTrapecio(start, end);
            this.history.addActionToHistory(trapecio, "figure");
        }
        else if (this.modo === "lapiz") {
            //guardar el dibujo libre en history action, creando una nueva figura
            const F = new Figura(ctx, this.color, this.grosor);
            F.puntos = this.freePixels;
            console.log(F);
            this.history.addActionToHistory(F, "figure");
            this.freePixels = [];

        }
        else if (this.modo === "borrar") {
            const ctx = this.getCurrentCanvasContext();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            this.layer2Ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.figuras = [];
            this.history.undoStack = [];
            this.history.redoStack = [];
        }

        this.history.renderizar(this.getCurrentCanvasContext());
    }

    moverFigura(start, end){

         // Obtener el contexto del canvas actual
         const ctx = this.getCurrentCanvasContext();
         //Recorrer el arreglo de figuras desde el ultimo agregado hacia atras para ver si pertenece a esa figura utilizando el isinside
         let figuraSeleccionada = this.history.seleccionarFigura(ctx,start);
         if (figuraSeleccionada){
            if (this.modo === "mover") {
                // figuraSeleccionada.trasladarFigura(end.x - start.x, end.y - start.y);
                this.history.trasladarFigura(start,end,figuraSeleccionada);
            } else if (this.modo === "rotar") {
                // figuraSeleccionada.rotarFigura(10);
                this.history.rotarFigura(figuraSeleccionada);
            }else if (this.modo === "escalar") {
                this.history.escalarFigura(end,figuraSeleccionada);
            } else if (this.modo === "HaciaAdelante") {
                this.history.forward(figuraSeleccionada);
            } else if (this.modo === "HaciaAtras") {
                this.history.backward(figuraSeleccionada);
            }
            else if (this.modo === "SubirCapa") {
                this.history.uplayer(figuraSeleccionada);
            }
            else if (this.modo === "BajarCapa") {
                this.history.downlayer(figuraSeleccionada);
            }else if (this.modo === "borrarFigura") {
                this.history.sacarFigura(figuraSeleccionada);
            }
            
            this.history.renderizar(ctx);
                
        } else {
            console.log("No hay figura seleccionada")
        }
    }

    lineTest(){
        console.log("empezando test");
        const ctx = this.getCurrentCanvasContext();
        const linea = new Linea(ctx);
        linea.testRendimiento();
        // linea.testRendimiento2();
        // linea.testRendimiento3();
    }
    getColorAtPixel(x, y) {
        var imageData = ctx.getImageData(x, y, 1, 1);
        var data = imageData.data;
        return [data[0], data[1], data[2], data[3]]; // RGBA
    }
    selectElement(start){
        // Obtener el contexto del canvas actual
        const ctx = this.getCurrentCanvasContext();
        this.figuraSeleccionada= this.history.seleccionarFigura(ctx,start);
        console.log(this.figuraSeleccionada);
    }

    limpiarCanvas(){
        //Limpiar el layer1 y 2
        const ctx = this.getCurrentCanvasContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.layer2Ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    exportarArchivo() {
        console.log("Exportar archivo");
        // Crear el div modal
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.classList.add('modal');
      
        // Crear los botones
        const pngButton = document.createElement('button');
        pngButton.textContent = 'Exportar PNG';
        pngButton.id = 'pngButton';
      
        const pdfButton = document.createElement('button');
        pdfButton.textContent = 'Exportar PDF';
        pdfButton.id = 'pdfButton';
      
        // Agregar los botones al modal
        modal.appendChild(pngButton);
        modal.appendChild(pdfButton);
      
        // Agregar el modal al cuerpo del documento
        document.body.appendChild(modal);
      
        // Establecer eventos de clic para los botones
        pngButton.addEventListener('click', () => this.exportarCanvas('png'));
        pdfButton.addEventListener('click', () => this.exportarCanvas('pdf'));
    }
      
    exportarCanvas(formato) {
        // Eliminar el modal
        const modal = document.getElementById('modal');
        modal.remove();
        // Obtener el canvas actual
        const canvas = this.getCurrentCanvas();
        const ctx = canvas.getContext('2d');
    
        if (formato.toLowerCase() === 'png') {
            // Convertir el canvas a imagen PNG y descargar
            const link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
            link.click();
        } else if (formato.toLowerCase() === 'pdf') {
            // Separar el elemento canvas 
            const canvas = this.getCurrentCanvas();
            const ctx = canvas.getContext('2d');
            const data = canvas.toDataURL('image/png');
            const img = new Image();
            img.src = data;

            //Imprimir con la impresora microsft print to pdf sin preguntar
            var printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write('<html><head><title>MI DIBUJO</title></head><body>');
            printWindow.document.write('<img src="' + data + '" onload="window.print();window.close()" />');
            printWindow.document.write('</body></html>');
            printWindow.document.close();

        } else {
            console.error('Formato no válido');
            return;
        }
    }
    
    guardarArchivo() {
        // A partir de redoStack y undoStack, guardar el estado actual del canvas en un archivo JSON
        const data = {
            undoStack: this.history.undoStack,
            redoStack: this.history.redoStack.map(action => {
                // Mapear cada acción en redoStack
                if (action.tipo === "figure") {
                    // Si es una figura, guardar el tipo de figura y los datos necesarios para reconstruirla
                    return {
                        tipo: "figure",
                        figura: {
                            tipoFigura: action.dato.constructor.name, // Guardar el nombre de la clase de la figura
                            datos: action.dato // Guardar los datos de la figura
                        }
                    };
                } else {
                    // Si no es una figura, simplemente devolver la acción tal como está
                    return action;
                }
            })
        };
    
        const jsonData = JSON.stringify(data);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.download = 'canvas.json';
        link.href = url;
        link.click();
    
        URL.revokeObjectURL(url);
    }
    
    abrirArchivo() {
        // Abrir un archivo JSON y restaurar el estado del canvas
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.click();
    
        input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();
    
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                this.history.undoStack = data.undoStack;
                this.history.redoStack = data.redoStack.map(action => {
                    // Mapear cada acción en redoStack
                    if (action.tipo === "figure") {
                        // Si es una figura, reconstruir la figura
                        const figuraData = action.figura;
                        const tipoFigura = figuraData.tipoFigura;
                        const datos = figuraData.datos;
    
                        // Aquí debes manejar la reconstrucción de la figura según el tipoFigura y los datos proporcionados
                        let figura;
                        switch (tipoFigura) {
                            case "Cuadrado":
                                figura = new Cuadrado(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Circulo":
                                figura = new Circulo(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Poligonos":
                                figura = new Poligonos(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end, datos.lados);
                                break;
                            case "Elipse":
                                figura = new Elipse(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Trapecio":
                                figura = new Trapecio(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Rectangulo":
                                figura = new Rectangulo(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Texto":
                                //Arreglar texto
                                figura = new Texto(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Linea":
                                figura = new Linea(this.getCurrentCanvasContext(), datos.color, datos.grosor, datos.start, datos.end);
                                break;
                            case "Figura":
                                figura = new Figura(this.getCurrentCanvasContext(), datos.color, datos.grosor);
                                figura.puntos = datos.puntos;
                                break;



                            // Agrega más casos según los tipos de figura que tengas
                            default:
                                console.error("Tipo de figura desconocido:", tipoFigura);
                                break;
                        }
    
                        return {
                            tipo: "figure",
                            dato: figura
                        };
                    } else {
                        // Si no es una figura, simplemente devolver la acción tal como está
                        return action;
                    }
                });
    
                console.log(this.history.undoStack);
                console.log(this.history.redoStack);
                this.history.renderizar(this.getCurrentCanvasContext());
            };
    
            reader.readAsText(file);
        });
    }
    
}      

// Exportar la clase
export { CanvasManager };