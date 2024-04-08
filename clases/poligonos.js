import { Linea } from "./linea.js";
import { Figura } from "./figuras.js";

class Poligonos extends Figura {
    constructor(ctx, color, grosor, start, end, lados) {
        super(ctx, color, grosor);
        this.start = start; // Centro
        this.end = end; // Punto final del apotema
        this.lados = parseInt(lados); // Convertir a número el número de lados del polígono
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

        // Dibujar el polígono y calcular los puntos internos
        this.drawPoligono(this.start, this.end, this.lados);
    }

        drawPoligono(center, apotema, lados) {
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
        
            // Dibujar los lados del polígono
            for (let i = 0; i < vertices.length; i++) {
                const start = vertices[i];
                const end = vertices[(i + 1) % lados];
                const linea = new Linea(this.ctx, this.color, this.grosor, start, end);
                this.puntos.push(linea.draw());
            }
        
            // Calcular los puntos internos del polígono
            this.calcularPuntosInternosDelPoligono(vertices);
        }
        
        calcularPuntosInternosDelPoligono(vertices) {
            // Obtener la mínima y máxima coordenada Y de los vértices
            const minY = Math.min(...vertices.map(vertex => vertex.y));
            const maxY = Math.max(...vertices.map(vertex => vertex.y));
        
            // Calcular los puntos internos del polígono
            for (let y = minY + 1; y < maxY; y++) {
                const intersections = [];
                for (let i = 0; i < vertices.length; i++) {
                    const start = vertices[i];
                    const end = vertices[(i + 1) % vertices.length];
                    if ((start.y <= y && end.y >= y) || (end.y <= y && start.y >= y)) {
                        const x = Math.round(start.x + (end.x - start.x) * (y - start.y) / (end.y - start.y));
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

export { Poligonos };