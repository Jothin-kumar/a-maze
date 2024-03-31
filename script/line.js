window.lines = {};

class Line {
    constructor(x1, y1, x2, y2) {
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", "line");
        window.lines[`${x1+x2},${y1+y2}`] = this;
        if (x1 == x2) {
            x1 -= .5
            x2 += .5
            y1 = y2 = y1+.5
        }
        else if (y1 == y2) {
            y1 -= .5
            y2 += .5
            x1 = x2 = x1+.5
        }
        this.elem.setAttribute("x1", x1*10);
        this.elem.setAttribute("y1", y1*10);
        this.elem.setAttribute("x2", x2*10);
        this.elem.setAttribute("y2", y2*10);
        this.elem.setAttribute("stroke", "white");
        window.mg.appendChild(this.elem);
    }
    hide() {
        this.elem.setAttribute("stroke", "black");
    }
}
for (let x = 1; x < 50; x++) {
    for (let y = 1; y < 50; y++) {
        new Line(x, y, x+1, y);
        new Line(x, y, x, y+1);
    }
}

function clearLine(x1, y1, x2, y2) {
    window.lines[`${x1+x2},${y1+y2}`].hide();
}

function pathLine(path) {
    for (let i = 0; i < path.length-1; i++) {
        clearLine(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
    }
}
