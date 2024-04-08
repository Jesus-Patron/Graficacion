import { Figura } from './figuras.js';

class Rectangulo extends Figura {
    constructor(ctx, color, grosor, start, end) {
        super(ctx, color, grosor);
        // Recibe las esquinas del rectángulo
        this.start = start;
        this.end = end;
    }

    // Dibujar el rectángulo
    draw() {
        // Calcular las coordenadas del rectángulo
        const minX = Math.min(this.start.x, this.end.x);
        const minY = Math.min(this.start.y, this.end.y);
        const maxX = Math.max(this.start.x, this.end.x);
        const maxY = Math.max(this.start.y, this.end.y);
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Dibujar el rectángulo
        this.drawRectangle(minX, minY, width, height);
    }
    
    drawRectangle(x, y, width, height) {
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                if (i === x || i === x + width - 1 || j === y || j === y + height - 1) {
                    this.drawPixel(i, j);
                    this.puntos.push({ x: i, y: j });
                } else {
                    this.puntosInternos.push({ x: i, y: j });
                }
            }
        }
    }
    

    // Método para limpiar el rectángulo
    clean() {
        this.puntos.forEach(punto => {
            this.borrarPixel(punto.x, punto.y);
        });
    }
}

export { Rectangulo };
