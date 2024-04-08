import { CanvasManager } from "./canvasManager";

class HistoryManager {
  constructor() {
    this.undoStack = []; // Historial de acciones para deshacer
    this.redoStack = []; // Historial de acciones para rehacer
  }


    

    sacarFigura(figura) {
        let actionRender = this.redoStack;
        for (let i = 0; i < actionRender.length; i++) {
            const action = actionRender[i];
            if (action.tipo === "figure" && action.dato === figura) {
                actionRender.splice(i, 1);
                break;
            }
        }

        //Buscar la figura en la pila de acciones y verificar si se encuentra e imprimir que se eliminó
        console.log("Se eliminó la figura", figura);
        console.log(this.redoStack)
    }


    forward(figura) {
        console.log("Hacia adelante", figura);
        let actionRender = this.redoStack;
        
        for (let i = 0; i < actionRender.length; i++) {
            const action = actionRender[i];
            
            if (action.tipo === "figure" && action.dato === figura) {
                console.log("posicion actual", i);
                actionRender.splice(i, 1);
                let objeto = {dato: figura, tipo: "figure"}
                actionRender.push(objeto);
                console.log("posicion nueva", actionRender.indexOf(figura));
                break;
            }
        }
    }
    backward(figura) {
        console.log("Hacia atrás", figura);
        let actionRender = this.redoStack;
        
        for (let i = 0; i < actionRender.length; i++) {
            const action = actionRender[i];
            
            if (action.tipo === "figure" && action.dato === figura) {
                console.log("posición actual", i);
                actionRender.splice(i, 1);
                let objeto = { dato: figura, tipo: "figure" };
                actionRender.unshift(objeto);
                console.log("posición nueva", actionRender.indexOf(figura));
                break;
            }
        }
    }
    
    uplayer(figura) {
        console.log("Subir capa", figura);
        let actionRender = this.redoStack;
        
        for (let i = 0; i < actionRender.length; i++) {
            const action = actionRender[i];
            
            if (action.tipo === "figure" && action.dato === figura) {
                console.log("posición actual", i);
                actionRender.splice(i, 1);
                let objeto = { dato: figura, tipo: "figure" };
                actionRender.splice(i + 1, 0, objeto);
                console.log("posición nueva", actionRender.indexOf(figura));
                break;
            }
        }
    }
    
    downlayer(figura) {
        console.log("Bajar capa", figura);
        let actionRender = this.redoStack;
        
        for (let i = 0; i < actionRender.length; i++) {
            const action = actionRender[i];
            
            if (action.tipo === "figure" && action.dato === figura) {
                console.log("posición actual", i);
                actionRender.splice(i, 1);
                let objeto = { dato: figura, tipo: "figure" };
                actionRender.splice(i - 1, 0, objeto);
                console.log("posición nueva", actionRender.indexOf(figura));
                break;
            }
        }
    }
    
    

    undo(ctx) {    
        if (this.redoStack.length > 0) {
            console.log("deshacer")
            let elemento = this.redoStack.pop();
            this.undoStack.push(elemento);

            console.log(this.undoStack)
            console.log(this.redoStack)
            this.renderizar(ctx);
        }
    }
    redo(ctx) {
        // Verificar si hay elementos para rehacer
        if (this.undoStack.length > 0) {
            // Sacar el último elemento de la pila de redo y guardarlo en la pila de undo
            let elemento = this.undoStack.pop();
            this.redoStack.push(elemento);

            // Renderizar la acción
            this.renderizar(ctx);
        }
    }
    getUndoStack() {
        return this.undoStack;
    }
    getRedoStack() {
        return this.redoStack;
    }   
    addActionToHistory(dato,tipo) {
        let elemento = {};
        elemento.dato = dato;
        elemento.tipo = tipo;
        this.redoStack.push(elemento);
    }



    renderizar(ctx) {
        const actionsRender = this.redoStack;
        // Dibujar todas las figuras en la pila de acciones
        for (const action of actionsRender) {
            if (action.tipo === "figure") {
                const figura = action.dato;
                // console.log(figura)
                figura.draw();
    
                // Si la figura está rellena, rellenarla después de dibujarla
                if (figura.estaRellena) {
                    figura.rellenar(ctx, null, figura.color);
                }
            }
        }
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
    seleccionarFigura(ctx, start) {
        // Seleccionar Figura
        let actionsRender = this.redoStack;
        let figuraSeleccionada = null;
        
        console.log(actionsRender)
        console.log(this.undoStack)
        actionsRender.forEach(action => {
            if (action.tipo === "figure") {
                // Verificar si las coordenadas del punto están dentro de la figura
                if (action.dato.isInside(start)) {
                    figuraSeleccionada = action.dato;
                }
            }
        });
    
        return figuraSeleccionada;
    }
    
    trasladarFigura(start, end, figuraSeleccionada){

        // Hacer que se elimine la figura y redibuje en la nueva posición y se guarde en el historial en la misma posición
        this.sacarFigura(figuraSeleccionada);
        // Calcular el desplazamiento
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        
        // Aplicar el desplazamiento a la posición inicial y final para mantener el tamaño de la figura
        figuraSeleccionada.start.x += dx;
        figuraSeleccionada.start.y += dy;
        figuraSeleccionada.end.x += dx;
        figuraSeleccionada.end.y += dy;
        
        // Redibujar la figura en la nueva posición
        figuraSeleccionada.puntosInternos = [];
        figuraSeleccionada.draw();
    
        this.addActionToHistory(figuraSeleccionada,"figure");
    }
    rotarFigura(figuraSeleccionada) {
        // Rotar de 10 en 10 grados
        const angulo = 10 * (Math.PI / 180); // Convertir a radianes
    
        // Sacar figura
        this.sacarFigura(figuraSeleccionada);
        figuraSeleccionada.puntosInternos = [];
    
        // Arreglo para almacenar las coordenadas de los puntos del cuadrado
        let nuevosPuntos = [];
    
        // Calcular el centro de la figura
        const centro = {
            x: (figuraSeleccionada.start.x + figuraSeleccionada.end.x) / 2,
            y: (figuraSeleccionada.start.y + figuraSeleccionada.end.y) / 2
        };
    
        // Rotar cada punto de la figura
        for (let i = 0; i < figuraSeleccionada.puntos.length; i++) {
            const punto = figuraSeleccionada.puntos[i];
            const x = punto.x - centro.x;
            const y = punto.y - centro.y;
            const newX = centro.x + x * Math.cos(angulo) - y * Math.sin(.5);
            const newY = centro.y + x * Math.sin(angulo) + y * Math.cos(.5);
            nuevosPuntos.push({ x: newX, y: newY });
        }
    
        // Asignar las nuevas coordenadas al arreglo de puntos de la figura
        figuraSeleccionada.puntos = nuevosPuntos;
    
        // Redibujar la figura en la nueva posición
        figuraSeleccionada.draw(); // Dibujar el cuadrado rotado
        this.addActionToHistory(figuraSeleccionada, "figure");
    }
    
    
    escalarFigura( end, figuraSeleccionada) {
        // Sacar figura
        this.sacarFigura(figuraSeleccionada);
        figuraSeleccionada.end = end;
        figuraSeleccionada.puntosInternos = [];
        figuraSeleccionada.draw();

        this.addActionToHistory(figuraSeleccionada,"figure");

    }
    

    
}

export { HistoryManager}