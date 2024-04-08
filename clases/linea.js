// Clase para las líneas
import { Figura } from "./figuras";

class Linea extends Figura{

    constructor(ctx, color, grosor, start, end) {
        super(ctx, color, grosor);
        this.start = start;
        this.end = end;
    }

    draw() {
        // Implementar en las clases hijas
        // console.log("Dibujando Linea");
        return this.drawDDA(this.start, this.end);
    }
    // Dibujar la línea
    // DIGITAL DIFFERENTIAL ANALYZER
    drawDDA(start, end) {
        // Algoritmo de DDA

        // Calcular la distancia entre los dos puntos
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        // Calcular el numero de pasos
        var steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
        // Calcular el incremento para cada paso
        var xIncrement = dx / steps;
        var yIncrement = dy / steps;
        // Coordenada inicial
        var x = start.x;
        var y = start.y;
        // Dibujar cada punto
        for (var i = 0; i <= steps; i++) {
            // Redondear las coordenadas
            var roundedX = Math.round(x);
            var roundedY = Math.round(y);

            // Dependiendo del grosor, dibujar más píxeles alrededor del punto
            this.drawPixel(roundedX, roundedY);
            //Guardar los puntos
            this.puntos.push({x: roundedX, y: roundedY});
            // Actualizar las coordenadas con el incremento
            x += xIncrement;
            y += yIncrement;
        }

        return this.puntos;
    }

    // Formula General de la Recta y = mx + b
    drawGeneral(start, end) {
        var dx = end.x - start.x;        // Delta x
        var dy = end.y - start.y;        // Delta y

        // Verificar si la línea es vertical
        if (dx === 0) {
            var yIncrement = (dy > 0) ? 1 : -1;
            for (var y = start.y; y !== end.y; y += yIncrement) {
                this.drawPixel(start.x, y);
            }
            this.drawPixel(end.x, end.y);
            return;
        }

        // Resto del código para el caso de una línea no vertical
        var m = dy / dx;
        var b = start.y - m * start.x;

        if (start.x > end.x) {
            var temp = start;
            start = end;
            end = temp;
        }

        var y = start.y;
        var x;
        var yIncrement = 1;
        var xIncrement = 1;

        // Manejar líneas con m cercanas a 0 o infinito
        if (Math.abs(m) < 1) {
            xIncrement = 1;
            yIncrement = m;
        } else {
            xIncrement = 1 / Math.abs(m);
            yIncrement = m < 0 ? -1 : 1;
        }

        for (var i = start.x; i <= end.x; i += xIncrement) {
            x = i;
            y = m * x + b;
            this.drawPixel(Math.round(x), Math.round(y));
            this.puntos.push({x: Math.round(x), y: Math.round(y)});
        }

        this.drawPixel(end.x, end.y);
        this.puntos.push({x: end.x, y: end.y});
        return this.puntos;
    }


    // LINEA BRESENHAM
    drawBresenham(start, end) {
        // Algoritmo de Bresenham
            
        // Calcular la distancia entre los dos puntos
        var dx = Math.abs(end.x - start.x);
        var dy = Math.abs(end.y - start.y);
            
        var sx = (start.x < end.x) ? 1 : -1; // si el punto inicial es menor que el punto final entonces sx = 1, de lo contrario sx = -1
        var sy = (start.y < end.y) ? 1 : -1; // si el punto inicial es menor que el punto final entonces sy = 1, de lo contrario sy = -1
        // Calcular el pk
        var pk = dx - dy;

        while (true) {
            // Dependiendo del grosor, dibujar más píxeles alrededor del punto

            this.drawPixel(start.x, start.y);

            if ((start.x === end.x) && (start.y === end.y)) {
                break;
            }

            var e2 = 2 * pk; // 2 * Δpk

            // Formulas del algoritmo de Bresenham

            // Primera condición: e2 > -dy
            if (e2 > -dy) {
                pk -= dy;      // Δpk -= Δy
                start.x += sx;  // x += sx
            }

            // Segunda condición: e2 < dx
            if (e2 < dx) {
                pk += dx;      // Δpk += Δx
                start.y += sy;  // y += sy
            }
        }
    }

    clean() {
        //Limpiar los puntos en el canvas
        for (var i = 0; i < this.puntos.length; i++) {
            this.borrarPixel(this.puntos[i].x, this.puntos[i].y);
        }
        
    }

    isInside(start) {
        // Si coincide con alguno de los puntos de la línea
        for (var i = 0; i < this.puntos.length; i++) {
            if (start.x === this.puntos[i].x && start.y === this.puntos[i].y) {
                return true;
            }
        }
        return false;
    }
    

    testRendimiento() {

        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        this.grosor = 1; //grosor de la linea
        let delay = 2000; 

        setTimeout(() => {
            this.color = "#000000"; //negro

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: i * (height / 1000) };
                const end = { x: width, y: i * (height / 1000) };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA horizontal I-D:  ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 3000;
        setTimeout(() => {
            this.color = "#FF0000"; //rojo

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: i * (height / 1000) };
                const end = { x: 0, y: i * (height / 1000) };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA horizontal D-I: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 4000;
        setTimeout(() => {
            this.color="#00FF00"; //Verde

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: 0 };
                const end = { x: i * (width / 1000), y: height };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA vertical  ↑ ↓: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 5000;
        setTimeout(() => {
            this.color="#0000FF"; //Azul

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: height };
                const end = { x: i * (width / 1000), y: 0 };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA vertical ↓ ↑: ", endTime - startTime, "ms");

        },delay);
       //*********************************************  REVISAR  */
        // DDA diagonal D-I ↑ ↓
        delay = 6000;
        setTimeout(() => {
            this.color="#FF00FF"; //Morado

            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                const start = { x: width * i / 1000, y: height * i / 1000 };
                const end = { x: width * (1000 - i) / 1000, y: height * (1000 - i) / 1000 };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA diagonal D-I ↑ ↓ : ", endTime - startTime, "ms");

        },delay);

        // DDA diagonal D-I ↓ ↑
        delay = 7000;
        setTimeout(() => {
            this.color="#00FFFF"; //Cyan

            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                const start = { x: width * i / 1000, y: height * (1000 - i) / 1000 };
                const end = { x: width * (1000 - i) / 1000, y: height * i / 1000 };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA diagonal D-I ↓ ↑ : ", endTime - startTime, "ms");

        },delay);

        // DDA diagonal I-D ↑ ↓
        delay = 8000;
        setTimeout(() => {
            this.color="#00F0F0"; // 

            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                const start = { x: width * i / 1000, y: height * (1000 - i) / 1000 };
                const end = { x: width * (1000 - i) / 1000, y: height * i / 1000 };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA diagonal I-D ↑ ↓: ", endTime - startTime, "ms");

        },delay);
                
        // DDA Diagonal I-D ↓ ↑ 
        delay = 9000;
        setTimeout(() => {
            this.color = "#0FFF00"; // 

            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                const start = { x: width * i / 1000, y: height * i / 1000 };
                const end = { x: width * (1000 - i) / 1000, y: height * (1000 - i) / 1000 };
                this.drawDDA(start, end);
            }
            let endTime = performance.now();
            console.log("DDA Diagonal I-D ↓ ↑:  ", endTime - startTime, "ms");

        },delay);


    }
    testRendimiento2() {    

        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        this.grosor = 1; //grosor de la linea
        let delay = 2000; 

        setTimeout(() => {
            this.color = "#000000"; //negro

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: i * (height / 1000) };
                const end = { x: width, y: i * (height / 1000) };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General horizontal I-D:  ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 3000;
        setTimeout(() => {
            this.color = "#FF0000"; //rojo

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: i * (height / 1000) };
                const end = { x: 0, y: i * (height / 1000) };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General horizontal D-I: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 4000;
        setTimeout(() => {
            this.color="#00FF00"; //Verde

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: 0 };
                const end = { x: i * (width / 1000), y: height };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General vertical  ↑ ↓: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 5000;
        setTimeout(() => {
            this.color="#0000FF"; //Azul

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: height };
                const end = { x: i * (width / 1000), y: 0 };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General vertical ↓ ↑: ", endTime - startTime, "ms");

        },delay);
       
        delay = 6000;

        setTimeout(() => {
            //Cambiar el color y aumentar el delay
            this.color="#FF00FF"; //Morado

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: 0 };
                const end = { x: 0, y: height };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General diagonal D-I ↑ ↓ : ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 7000;
        setTimeout(() => {
            this.color="#00FFFF"; //Cyan

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: height };
                const end = { x: 0, y: 0 };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General diagonal D-I ↓ ↑ : ", endTime - startTime, "ms");

        },delay);

        //cambiar el color y delay
        delay = 8000;
        setTimeout(() => {
            this.color="#00F0F0";// 

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: height };
                const end = { x: width, y: 0 };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General diagonal I-D ↓ ↑: ", endTime - startTime, "ms");

        },delay);
        
        //Cambiar el color y aumentar el delay
        delay = 9000;
        setTimeout(() => {
            this.color = "#0FFF00"; // 

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: height };
                const end = { x: width, y: 0 };
                this.drawGeneral(start, end);
            }
            let endTime = performance.now();
            console.log("General Diagonal I-D ↑ ↓:  ", endTime - startTime, "ms");

        },delay);

    }
    testRendimiento3() {

        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        this.grosor = 1; //grosor de la linea
        let delay = 2000; 

        setTimeout(() => {
            this.color = "#000000"; //negro

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: i * (height / 1000) };
                const end = { x: width, y: i * (height / 1000) };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham horizontal I-D:  ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 3000;
        setTimeout(() => {
            this.color = "#FF0000"; //rojo

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: i * (height / 1000) };
                const end = { x: 0, y: i * (height / 1000) };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham horizontal D-I: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 4000;
        setTimeout(() => {
            this.color="#00FF00"; //Verde

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: 0 };
                const end = { x: i * (width / 1000), y: height };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham vertical  ↑ ↓: ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 5000;
        setTimeout(() => {
            this.color="#0000FF"; //Azul

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: i * (width / 1000), y: height };
                const end = { x: i * (width / 1000), y: 0 };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham vertical ↓ ↑: ", endTime - startTime, "ms");

        },delay);
       
        delay = 6000;

        setTimeout(() => {
            //Cambiar el color y aumentar el delay
            this.color="#FF00FF"; //Morado

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: 0 };
                const end = { x: 0, y: height };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham diagonal D-I ↑ ↓ : ", endTime - startTime, "ms");

        },delay);

        //Cambiar el color y aumentar el delay
        delay = 7000;
        setTimeout(() => {
            this.color="#00FFFF"; //Cyan

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: width, y: height };
                const end = { x: 0, y: 0 };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham diagonal D-I ↓ ↑ : ", endTime - startTime, "ms");

        },delay);

        //cambiar el color y delay
        delay = 8000;
        setTimeout(() => {
            this.color="#00F0F0";// 

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: height };
                const end = { x: width, y: 0 };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham diagonal I-D ↓ ↑: ", endTime - startTime, "ms");

        },delay);
        
        //Cambiar el color y aumentar el delay
        delay = 9000;
        setTimeout(() => {
            this.color = "#0FFF00"; // 

            const startTime = performance.now()
            for (let i = 0; i < 1000; i++) {
                const start = { x: 0, y: height };
                const end = { x: width, y: 0 };
                this.drawBressenham(start, end);
            }
            let endTime = performance.now();
            console.log("Bressenham Diagonal I-D ↑ ↓:  ", endTime - startTime, "ms");

        },delay);

    }
    
    

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
     }
    
    
}

export { Linea };