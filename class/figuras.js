class Figura {
    constructor(ctx, color, grosor) {
        this.ctx = ctx;
        this.color = color;
        this.grosor = grosor;
        this.puntos = [];
        this.puntosInternos = [];
        this.estaRellena = false;
        this.colorRelleno = null;
    }

    // Dibujar la figura (método abstracto)
    draw() {
        this.puntos.forEach(punto => {
            this.drawPixel(punto.x, punto.y);
        });
    }

    drawPixel(x, y) {
        // Obtener el contexto del lienzo
        const ctx = this.ctx;
        const color = this.color;
        const grosor = this.grosor;

        // Ajustar el canal alfa del color para que sea el más bajo posible (0)
        const colorWithAlpha = color.replace(/[^,]+(?=\))/, '0');
        // Establecer el color de relleno
        ctx.fillStyle = colorWithAlpha;
        // Dibujar un rectángulo de un solo píxel en la posición dada
        ctx.fillRect(x, y, grosor, grosor);
        // Restaurar el estado del contexto
        ctx.restore();
    }
    
    
    
    // Establecer el contexto de dibujo
    setContext(newContext) {
        this.ctx = newContext;
    }

    // Establecer el color de la figura
    setColor(newColor) {
        this.color = newColor;
    }

    rellenar(ctx,targetColor,fillColor){
        this.estaRellena = true
        if (this.estaRellena){

            this.ctx = ctx

            if (targetColor == fillColor){
                console.log("Ya tiene ese color", targetColor,fillColor)
                this.estaRellena = false
                return
            }
            // console.log(fillColor)
            this.color = fillColor
            //Dibujar todos los puntos internos
            this.puntosInternos.forEach(punto => {
                this.drawPixel(punto.x, punto.y);
            });
        }
    }
    isInside(point) {
        // Verificar si el punto está dentro de la figura considerando un margen de ±0.5
        for (let i = 0; i < this.puntosInternos.length; i++) {
            const deltaX = Math.abs(point.x - this.puntosInternos[i].x);
            const deltaY = Math.abs(point.y - this.puntosInternos[i].y);
            if (deltaX <= 0.5 && deltaY <= 0.5) {
                return true;
            }
        }
        return false;
    }
    // Establecer el grosor del trazo
    setGrosor(newGrosor) {
        this.grosor = newGrosor;
    }

    // Borrar un píxel en las coordenadas especificadas
    borrarPixel(x, y) {
        var halfThickness = Math.floor(this.grosor / 2);

        for (var i = -halfThickness; i <= halfThickness; i++) {
            for (var j = -halfThickness; j <= halfThickness; j++) {
                // Borrar el pixel
                this.ctx.clearRect(x + i, y + j, 1, 1);
            }
        }
    }
    trasladarFigura(dx, dy) {
        console.log("Trasladar figura", dx, dy);
        
        const copiaPuntos = this.puntos;
        const copiaPuntosInternos = this.puntosInternos;
        // Trasladar los puntos existentes en la figura
       for (let i = 0; i < copiaPuntos.length; i++) {
            copiaPuntos[i].x = copiaPuntos[i].x - dx;
            copiaPuntos[i].y = copiaPuntos[i].y - dy;
        }
        //Vaciar el arreglo de puntos
        this.puntos = [];
        //Agregar los puntos trasladados
        this.puntos = copiaPuntos;

        // Trasladar los puntos internos existentes en la figura   
        for (let i = 0; i < copiaPuntosInternos.length; i++) {
            copiaPuntosInternos[i].x = copiaPuntosInternos[i].x - dx;
            copiaPuntosInternos[i].y = copiaPuntosInternos[i].y - dy;
        }
        //Vaciar el arreglo de puntos internos
        this.puntosInternos = [];
        //Agregar los puntos internos trasladados
        this.puntosInternos = copiaPuntosInternos;

        console.log(this.puntos);
        console.log(this.puntosInternos);

    }
    
    
    rotarFigura(angulo) {
        console.log(angulo)
        // Obtener el centro de la figura
        const centro = this.calcularCentro();
        // Rotar la figura
        this.puntos = this.puntos.map(punto => {
            return this.rotarPunto(punto, centro, angulo);
        });
        this.puntosInternos = this.puntosInternos.map(punto => {
            return this.rotarPunto(punto, centro, angulo);
        });
    }

    escalarFigura(factor) {
        // Obtener el centro de la figura
        const centro = this.calcularCentro();
        // Escalar la figura
        this.puntos = this.puntos.map(punto => {
            return this.escalarPunto(punto, centro, factor);
        });
        this.puntosInternos = this.puntosInternos.map(punto => {
            return this.escalarPunto(punto, centro, factor);
        });
    }

    calcularCentro() {
        // Calcular el centro de la figura
        const x = this.puntos.reduce((sum, punto) => sum + punto.x, 0) / this.puntos.length;
        const y = this.puntos.reduce((sum, punto) => sum + punto.y, 0) / this.puntos.length;
        return { x, y };
    }

    rotarPunto(punto, centro, angulo) {
        // Rotar el punto en torno al centro
        const x = centro.x + (punto.x - centro.x) * Math.cos(angulo) - (punto.y - centro.y) * Math.sin(angulo);
        const y = centro.y + (punto.x - centro.x) * Math.sin(angulo) + (punto.y - centro.y) * Math.cos(angulo);
        return { x, y };
    }

    escalarPunto(punto, centro, factor) {
        // Escalar el punto en torno al centro
        const x = centro.x + (punto.x - centro.x) * factor;
        const y = centro.y + (punto.y - centro.y) * factor;
        return { x, y };
    }

    // Limpiar la figura
    clean() {
        this.puntos.forEach(punto => {
            this.borrarPixel(punto.x, punto.y);
        });
        this.puntosInternos.forEach(punto => {
            this.borrarPixel(punto.x, punto.y);
        });
    }

}

export { Figura };
