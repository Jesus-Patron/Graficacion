import { Figura } from "./figuras";

class Circulo extends Figura {
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

    // Limpiar el canvas antes de dibujar
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Ajustar el radio vertical para que coincida con el radio horizontal
    const radius = Math.sqrt(
      Math.pow(this.end.x - this.start.x, 2) +
      Math.pow(this.end.y - this.start.y, 2)
    ) / 2;

    // Dibujar el círculo
    this.drawBressenhamCircle(this.start, radius);
  }

  drawPoints(centerX, centerY, x, y) {
    this.drawPixel(centerX + x, centerY + y); // Octante 1
    this.drawPixel(centerX - x, centerY + y); // Octante 2
    this.drawPixel(centerX + x, centerY - y); // Octante 8
    this.drawPixel(centerX - x, centerY - y); // Octante 7
    
    // Los puntos simétricos en otros octantes
    this.drawPixel(centerX + y, centerY + x); // Octante 3
    this.drawPixel(centerX - y, centerY + x); // Octante 4
    this.drawPixel(centerX + y, centerY - x); // Octante 6
    this.drawPixel(centerX - y, centerY - x); // Octante 5

    this.puntos.push({ x: centerX + x, y: centerY + y });
    this.puntos.push({ x: centerX - x, y: centerY + y });
    this.puntos.push({ x: centerX + x, y: centerY - y });
    this.puntos.push({ x: centerX - x, y: centerY - y });
    this.puntos.push({ x: centerX + y, y: centerY + x });
    this.puntos.push({ x: centerX - y, y: centerY + x });
    this.puntos.push({ x: centerX + y, y: centerY - x });
    this.puntos.push({ x: centerX - y, y: centerY - x });
  }

  drawBressenhamCircle(center, radius) {
    let x = radius;
    let y = 0;
    let P = 1 - radius;

    while (x >= y) {
        this.drawPoints(center.x, center.y, x, y);
        if (P <= 0) {
            P = P + 2 * y + 1;
        } else {
            x--;
            P = P + 2 * y - 2 * x + 1;
        }
        y++;
    }
    
    // Limpiar la lista de puntos internos
    this.puntosInternos = [];

    // Calcular los puntos internos utilizando la ecuación del círculo
    for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
            // Calcular la distancia desde el punto al centro del círculo
            const distanceSquared = i * i + j * j;
            if (distanceSquared <= radius * radius) {
                // Si la distancia es menor o igual al radio del círculo, agregar el punto a la lista de puntos internos
                this.puntosInternos.push({ x: center.x + i, y: center.y + j });
            }
        }
    }
}



}

export { Circulo };