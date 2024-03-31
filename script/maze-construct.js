window.mazeDots = {}

class MazeDot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.used = false;
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

class Path {
    constructor(start) {
        this.start = start;
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
        dot.used = true;
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
        this.end = this.path[this.path.length-1];
        this.end.type = "end";
    }
    reset() {
        Object.values(window.mazeDots).forEach(dot => {
            dot.type = "";
        });
        this.path = [this.start];
        this.start.type = "start";
    }
}
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

function constructPath(start) {
    start.type = "start";
    const path = new Path(start);
    while (path.path.length < 100) {
        try {
            let neighbors = getUnusedNeighbors(path.path[path.path.length-1]);
            if (Object.keys(neighbors).length === 0) {
                path.path[path.path.length-1].type = "prohibited";
                path.path.pop();
            }
            else {
                choosen = pickRandomElement(Object.values(neighbors));
                path.addDot(choosen);
                Object.values(neighbors).forEach(dot => {
                    if (dot !== choosen) {
                        dot.type = "prohibited";
                    }
                });
            }
        }
        catch (e) {
            console.warn(e);
            console.log("resetting...");
            path.reset();
        }
    }
    path.finish();
    Object.values(window.mazeDots).filter(dot => dot.type === "prohibited").forEach(dot => {  // Dots prohibited only for current path
        dot.type = "";
    })
    return path;
}

const mp = window.mp = constructPath(pickRandomElement(Object.values(window.mazeDots))); // Main path

while (Object.values(window.mazeDots).filter(dot => !dot.used).length > 50) {
    let path = constructPath(pickRandomElement(Object.values(window.mazeDots).filter(dot => !dot.type)));
    path.path.forEach(dot => {
        dot.setColor('yellow');
    })
}

mp.path.forEach(dot => {
    dot.setColor('blue');
    dot.setRadius(2);
})
mp.start.setColor('green');
mp.start.setRadius(3);
mp.end.setColor('red');
mp.end.setRadius(3);