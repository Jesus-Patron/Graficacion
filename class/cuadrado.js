import { Figura } from './figuras.js';

class Cuadrado extends Figura {
    constructor(ctx, color, grosor, start, end) {
        super(ctx, color, grosor);
        // Recibe la diagonal del cuadrado
        this.start = start;
        this.end = end;
    }

    // Dibujar el cuadrado
    draw() {
        // Calcular las coordenadas del cuadrado
        const minX = Math.min(this.start.x, this.end.x);
        const minY = Math.min(this.start.y, this.end.y);
        const lado = Math.max(Math.abs(this.start.x - this.end.x), Math.abs(this.start.y - this.end.y));
        
        // Dibujar el cuadrado
        this.drawSquare(minX, minY, lado);
    }

    // Método para dibujar el cuadrado
    drawSquare(x, y, lado) {
        for (let i = x; i <= x + lado; i++) {
            for (let j = y; j <= y + lado; j++) {
                if (i === x || i === x + lado || j === y || j === y + lado) {
                    this.drawPixel(i, j);
                    this.puntos.push({ x: i, y: j });
                } else {
                    this.puntosInternos.push({ x: i, y: j });
                }
            }
        }
    }

    // Método para limpiar el cuadrado
    clean() {
        this.puntos.forEach(punto => {
            this.borrarPixel(punto.x, punto.y);
        });
    }
}

export { Cuadrado };
