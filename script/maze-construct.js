window.mazeDots = {}

class MazeDot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.elem.setAttribute('cx', x*10);
        this.elem.setAttribute('cy', y*10);
        this.elem.setAttribute('r', 1);
        this.elem.setAttribute('fill', 'rgba(255, 255, 255, .5)');
        window.mg.appendChild(this.elem);
        window.mazeDots[`${x},${y}`] = this;
    }
    setColor(color) {
        this.elem.setAttribute('fill', color);
    }
    setRadius(radius) {
        this.elem.setAttribute('r', radius);
    }
}

const mg = window.mg = document.getElementById('maze-grid');

for (let x = 1; x < 50; x++) {
    for (let y = 1; y < 50; y++) {
        new MazeDot(x, y);
    }
}

const start = pickRandomElement(Object.values(window.mazeDots));
start.setColor("green");
start.setRadius(3);
start.type = "start";

class Path {
    constructor() {
        this.path = [start];
    }
    addDot(dot) {
        if (this.path.includes(dot)) {
            throw new DotAlreadyInUseError(`Dot already in use with type ${dot.type}`);
        }
        if (dot.type === "prohibited") {
            return false;
        }
        this.path.push(dot);
        dot.setColor("blue");
        dot.setRadius(2);
        dot.type = "path";
        return true;
    }
    finish() {
        if (this.path.length < 10) {
            throw new PathInvalidError("Path too short");
        }
        if (this.path.length > 100) {
            throw new PathInvalidError("Path too long");
        }
        this.path[this.path.length-1].setColor("red");
        this.path[this.path.length-1].setRadius(3);
        this.path[this.path.length-1].type = "end";
    }
    reset() {
        Object.values(window.mazeDots).forEach(dot => {
            dot.setColor("rgba(255, 255, 255, .5)");
            dot.setRadius(1);
            dot.type = "";
        });
        this.path = [start];
        start.setColor("green");
        start.setRadius(3);
        start.type = "start";
    }
}
const path = window.path = new Path();

function getUnusedNeighbors(dot) {
    const neighbors = {};
    function handler(x, y) {
        let potentialUnusedNeighbor = window.mazeDots[`${dot.x+x},${dot.y+y}`];
        if (potentialUnusedNeighbor && !potentialUnusedNeighbor.type) {
            neighbors[`${x},${y}`] = (potentialUnusedNeighbor);
        }
    }
    [[1, 0], [-1, 0] ,[0, 1], [0, -1]].forEach(([x, y]) => handler(x, y));
    return neighbors;
}

while (path.path.length < 100) {
    try {
        let neighbors = getUnusedNeighbors(path.path[path.path.length-1]);
    if (Object.keys(neighbors).length === 0) {
        path.path[path.path.length-1].setColor("black");
        path.path[path.path.length-1].type = "prohibited";
        path.path.pop();
    }
    else {
        choosen = pickRandomElement(Object.values(neighbors));
        path.addDot(choosen);
        Object.values(neighbors).forEach(dot => {
            if (dot !== choosen) {
                dot.setColor("black");
                dot.type = "prohibited";
            }
        });
    }
    }
    catch (e) {
        console.error(e);
        console.log("resetting...");
        path.reset();
    }
}
path.finish();