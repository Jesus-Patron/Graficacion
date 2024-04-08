import { Linea } from "./linea.js";
import { Figura } from "./figuras.js";

class Trapecio extends Figura {
    constructor(ctx, color, grosor, start, end, lados) {
        super(ctx, color, grosor);
        this.start = start; // Centro
        this.end = end; // Punto final del apotema
        this.lados = parseInt(6); // Convertir a número el número de lados del polígono
    }

    draw() {
        if (!this.ctx) {
            console.error("El contexto del canvas no es válido.");
            return;
        }
        if (
            typeof this.start.x !== "number" ||
            typeof this.start.y !== "number" ||
            typeof this.end.x !== "number" ||
            typeof this.end.y !== "number" ||
            typeof this.lados !== "number"
        ) {
            console.error("Las coordenadas y el número de lados deben ser números.");
            return;
        }

        // Dibujar el trapecio y calcular los puntos internos
        this.drawTrapecio(this.start, this.end, this.lados);
    }

    drawTrapecio(center, apotema, lados) {
        // Calcular el radio
        const radius = Math.sqrt(
            Math.pow(apotema.x - center.x, 2) +
            Math.pow(apotema.y - center.y, 2)
        );
    
        // Calcular el ángulo entre los lados
        const angle = (2 * Math.PI) / lados;
    
        // Calcular los vértices del polígono
        let vertices = [];
        for (let i = 0; i < lados; i++) {
            const x = center.x + radius * Math.cos(i * angle);
            const y = center.y + radius * Math.sin(i * angle);
            vertices.push({ x, y });
        }

       
      
        // Dibujar las líneas del trapecio
        const lineaSuperior = new Linea(this.ctx, this.color, this.grosor, vertices[0], vertices[1]);
        const lineaInferior = new Linea(this.ctx, this.color, this.grosor, vertices[3], vertices[2]);
        const lineaIzquierda = new Linea(this.ctx, this.color, this.grosor, vertices[0], vertices[3]);
        const lineaDerecha = new Linea(this.ctx, this.color, this.grosor, vertices[1], vertices[2]);
        
        this.puntos.push(lineaSuperior.draw());
        this.puntos.push(lineaInferior.draw());
        this.puntos.push(lineaIzquierda.draw());
        this.puntos.push(lineaDerecha.draw());
        // console.log(this.puntos);

        let verticesTrapecio = [vertices[0], vertices[1], vertices[2], vertices[3]];
        this.calcularPuntosInternosDelTrapecio(verticesTrapecio);

    }

    calcularPuntosInternosDelTrapecio(vertices) {
        // Obtener la mínima y máxima coordenada Y de los vértices
        const minY = Math.min(...vertices.map(vertex => vertex.y));
        const maxY = Math.max(...vertices.map(vertex => vertex.y));
    
        // Calcular los puntos internos del trapecio
        for (let y = minY + 1; y < maxY; y++) {
            const intersections = [];
            for (let i = 0; i < vertices.length; i++) {
                const start = vertices[i];
                const end = vertices[(i + 1) % vertices.length];
                if ((start.y <= y && end.y >= y) || (end.y <= y && start.y >= y)) {
                    let x = start.x + (end.x - start.x) * (y - start.y) / (end.y - start.y);
                    // Restar la mitad del grosor para ajustar el punto interno
                    x -= this.grosor / 2;
                    const roundedY = Math.round(y); // Redondear la coordenada Y
                    intersections.push({ x, y: roundedY });
                }
            }
            intersections.sort((a, b) => a.x - b.x);
            for (let i = 0; i < intersections.length; i += 2) {
                for (let x = intersections[i].x; x < intersections[i + 1].x; x++) {
                    const roundedX = Math.round(x); // Redondear la coordenada X
                    this.puntosInternos.push({ x: roundedX, y: intersections[i].y });
                }
            }
        }
    }
        
}

export { Trapecio };