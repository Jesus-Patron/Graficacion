import { Figura } from "./figuras.js";

class Elipse extends Figura {
  constructor(ctx, color, grosor, start, end) {
    super(ctx, color, grosor);
    this.start = start; // Centro
    this.end = end; // Punto final del radio
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
      typeof this.end.y !== "number"
    ) {
      console.error("Las coordenadas y el radio deben ser números.");
      return;
    }

    // Dibujar la elipse
    this.drawElipse(this.start, this.end);

    // Calcular los puntos internos
    this.calcularPuntosInternos();
  }

  drawElipse(center, radius) {
    const radiusX = Math.abs(radius.x - center.x);
    const radiusY = Math.abs(radius.y - center.y);

    const paso = 0.01;
    for (let t = 0; t < 2 * Math.PI; t += paso) {
      const x = center.x + radiusX * Math.cos(t);
      const y = center.y + radiusY * Math.sin(t);
      this.drawPixel(x, y); // Dibujar el punto
      this.puntos.push({ x, y });
    }
    this.ctx.closePath();
  }

  calcularPuntosInternos() {
    // Limpiar los puntos internos previos
    this.puntosInternos = [];

    // Obtener el centro y los radios de la elipse
    const centerX = this.start.x;
    const centerY = this.start.y;
    const radiusX = Math.abs(this.end.x - this.start.x);
    const radiusY = Math.abs(this.end.y - this.start.y);

    // Calcular los puntos internos utilizando la ecuación de la elipse
    for (let x = centerX - radiusX; x <= centerX + radiusX; x++) {
      for (let y = centerY - radiusY; y <= centerY + radiusY; y++) {
        if (this.isInsideEllipse({ x, y }, centerX, centerY, radiusX, radiusY)) {
          this.puntosInternos.push({ x, y });
        }
      }
    }
  }

  isInsideEllipse(point, centerX, centerY, radiusX, radiusY) {
    const dx = (point.x - centerX) / radiusX;
    const dy = (point.y - centerY) / radiusY;
    return dx * dx + dy * dy <= 1;
  }
}

export { Elipse };
