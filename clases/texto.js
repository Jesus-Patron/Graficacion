import { Figura } from './figuras.js';
import { Rectangulo } from './rectangulo.js';

class Texto extends Figura {
    constructor(ctx, color, grosor, x, y) {
        super(ctx, color, grosor);
        // Posición del texto
        this.start = x;
        this.end = y;
        // Texto a dibujar
        this.texto ="";

        // Color Blanco

    }

    // Dibujar el texto
    draw() {

        if (!this.texto){
            this.texto= prompt('Por favor, ingrese el texto que desea dibujar:', '');
        }

        let colorR = '#ffffff';
        const rectangulo = new Rectangulo(this.ctx, colorR, this.grosor, this.start, this.end);
        this.rectangulo = rectangulo;
        // Dibujar el rectángulo transparente
        this.rectangulo.draw();

        // Guardar los puntos y puntos internos del rectángulo
        this.puntos = this.rectangulo.puntos;
        this.puntosInternos = this.rectangulo.puntosInternos;

        // Dibujar el texto
        this.ctx.fillStyle = 'black'; // Establecer el color del texto en negro
        // Dibujar el texto centrado dentro del rectángulo
        const textoWidth = this.ctx.measureText(this.texto).width;
        const textoHeight = parseInt(this.ctx.font);
        const textoX = this.rectangulo.start.x + (this.rectangulo.end.x - this.rectangulo.start.x) / 2 - textoWidth / 2;
        const textoY = this.rectangulo.start.y + (this.rectangulo.end.y - this.rectangulo.start.y) / 2 + textoHeight / 2;

        this.ctx.fillText(this.texto, textoX, textoY);

    }
}

export { Texto };