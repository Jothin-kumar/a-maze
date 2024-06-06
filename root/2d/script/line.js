window.lines = {};

class Line {
    constructor(x1, y1, x2, y2) {
        this.x = x1+x2
        this.y = y1+y2
        this.hidden = false
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
        window.addEventListener("zoomChange", () => {
            this.elem.setAttribute("x1", x1*10*zoom);
            this.elem.setAttribute("y1", y1*10*zoom);
            this.elem.setAttribute("x2", x2*10*zoom);
            this.elem.setAttribute("y2", y2*10*zoom);
            this.elem.setAttribute("stroke-width", zoom);
        })
        this.elem.setAttribute("stroke", "olive");
        window.mg.appendChild(this.elem);
    }
    hide() {
        this.elem.setAttribute("stroke", "black");
        this.hidden = true
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

function checkIfLineNotHidden(x1, y1, x2, y2) {
    return !window.lines[`${x1+x2},${y1+y2}`].hidden;
}