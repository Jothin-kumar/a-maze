class MazeSquare {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.used = false;
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.indicator = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.indicator.setAttribute('fill', 'white');
        this.indicator.style.display = "none";
        window.addEventListener("zoomChange", () => {
            this.elem.setAttribute('width', 10*zoom);
            this.elem.setAttribute('height', 10*zoom);
            this.elem.setAttribute('x', ((x-.25)*10-5)*zoom);
            this.elem.setAttribute('y', ((y-.25)*10-5)*zoom);
            this.indicator.setAttribute('cx', ((x-.25)*10)*zoom);
            this.indicator.setAttribute('cy', ((y-.25)*10)*zoom);
            this.indicator.setAttribute('r', 1*zoom);
        })
        this.elem.setAttribute('fill', 'black');
        window.mg.appendChild(this.elem);
        window.mg.appendChild(this.indicator);
        window.mazeSquares[`${x},${y}`] = this;
        this.blink = false;
    }
    setColor(color) {
        this.elem.setAttribute('fill', color);
    }
    async startBlink () {
        this.blink = true;
        while (this.blink) {
            this.elem.setAttribute("fill-opacity", 1);
            await new Promise(r => setTimeout(r, 690));
            if (this.blink) {this.elem.setAttribute("fill-opacity", .69);}
            await new Promise(r => setTimeout(r, 169));
        }
    }
    stopBlink () {
        this.blink = false;
        this.elem.style.opacity = 1;
        this.elem.setAttribute("fill-opacity", 1);
    }
}

const mg = window.mg = document.getElementById('maze-grid');

class Path {
    constructor(start) {
        this.start = start;
        this.path = [start];
    }
    addDot(dot) {
        if (this.path.includes(dot) || dot.used) {
            throw new DotAlreadyInUseError(`Dot already in use with type ${dot.type}`);
        }
        if (dot.type === "prohibited") {
            return false;
        }
        this.path.push(dot);
        dot.type = "path";
        return true;
    }
    finish() {
        this.path.forEach((d) => {
            d.used = true
        })
        this.end = this.path[this.path.length-1];
        this.end.type = "end";
    }
    reset() {
        Object.values(window.mazeSquares).forEach(dot => {
            dot.type = "";
        });
        this.path = [this.start];
        this.start.type = "start";
    }
}
function getUnusedNeighbors(dot) {
    const neighbors = {};
    function handler(x, y) {
        let potentialUnusedNeighbor = window.mazeSquares[`${dot.x+x},${dot.y+y}`];
        if (potentialUnusedNeighbor && !potentialUnusedNeighbor.type) {
            neighbors[`${x},${y}`] = (potentialUnusedNeighbor);
        }
    }
    [[1, 0], [-1, 0] ,[0, 1], [0, -1]].forEach(([x, y]) => handler(x, y));
    return neighbors;
}

function constructPath(start, pathLength = 169, condition = (dot) => true){
    start.type = "start";
    const path = new Path(start);
    while (path.path.length < pathLength) {
        if (path.path.length === 0) path.reset()
        let neighbors = getUnusedNeighbors(path.path[path.path.length-1]);
        if (Object.keys(neighbors).length === 0) {
            path.path[path.path.length-1].type = "prohibited";
            path.path.pop();
        }
        else {
            choosen = pickRandomElement(Object.values(neighbors));
            if (!condition(choosen)) {
                path.finish()
                Object.values(window.mazeSquares).filter(dot => dot.type === "prohibited").forEach(dot => {  // Dots prohibited only for current path
                    dot.type = "";
                })
                return path;
            }
            path.addDot(choosen);
            Object.values(neighbors).forEach(dot => {
                if (dot !== choosen) {
                    dot.type = "prohibited";
                }
            });
        }
    }
    path.finish();
    Object.values(window.mazeSquares).filter(dot => dot.type === "prohibited").forEach(dot => {  // Dots prohibited only for current path
        dot.type = "";
    })
    return path;
}

var c = 0
function preConstruct() {
    if (window.mazeSquares) {
        Object.values(window.mazeSquares).forEach((d) => {
            d.elem.remove();
        })
    }
    if (window.lines) {
        Object.values(window.lines).forEach((d) => {
            d.elem.remove();
        })
    }
    window.mazeSquares = {}
    window.lines = {};
    for (let x = 1; x < window.gridSize + 1; x++) {
        for (let y = 1; y < window.gridSize + 1; y++) {
            new MazeSquare(x, y);
        }
    }
    for (let x = 0; x < window.gridSize + 2; x++) {
        for (let y = 0; y < window.gridSize + 2; y++) {
            new Line(x, y, x+1, y);
            new Line(x, y, x, y+1);
        }
    }
}
async function construct() {
    preConstruct();
    const loader = document.getElementById("loader-msg")
    const vals = {
        25: [69, 88, 10, 20],
        49: [169, 175, 50, 25],
        69: [200, 256, 69, 88]
    }
    const val = vals[window.gridSize]
    window.mp = constructPath(pickRandomElement(Object.values(window.mazeSquares)), randRange(val[0], val[1])); // Main path
    pathLine(mp.path);
    const maxIter = 10000
    const fp = 100/maxIter
    const fp_ = maxIter/100
    c = 0
    while (Object.values(window.mazeSquares).filter((d) => !d.used).length > 0 && c < maxIter) {
        pathLine(constructPath(pickRandomElement(Object.values(window.mazeSquares).filter((d) => d.used)), randRange(val[2], val[3]), (dot) => !dot.used).path);
        if (c % fp_ === 0) {
            loader.innerHTML = `&ge; ${(c*fp).toString().padStart(2, "0")}%`
            await new Promise(r => setTimeout(r, 0));
        }
        c++;
    }
    loader.innerHTML = "Loading..."
    postConstruct();
}
function postConstruct() {
    const toClear = Object.values(window.mazeSquares).filter((d) => {
        function checkUsageWithRespectToLine(x1, y1, x2, y2) {
            try {
                return checkIfLineNotHidden(x1, y1, x2, y2);
            }
            catch {
                return true;
            }
        }
        if (
            checkUsageWithRespectToLine(d.x, d.y, d.x+1, d.y) &&
            checkUsageWithRespectToLine(d.x, d.y, d.x, d.y+1) &&
            checkUsageWithRespectToLine(d.x, d.y, d.x-1, d.y) &&
            checkUsageWithRespectToLine(d.x, d.y, d.x, d.y-1)
        ) {
            return true;
        }
    })
    toClear.forEach((d) => {
        function handler (x, y) {
            if (toClear.includes(window.mazeSquares[`${d.x+x},${d.y+y}`])) {
                clearLine(d.x, d.y, d.x+x, d.y+y);
                window.lines[`${d.x*2+x},${d.y*2+y}`].ignore = true;
            }
        }
        handler(1, 0);
        handler(0, 1);
        handler(-1, 0);
        handler(0, -1);
    });

    mp.end.setColor("red");
    document.getElementById("main").style.display = "block"
    document.getElementById("controls").style.display = "flex"
    document.getElementById("loading").style.display = "none"
    window.navNotAllowed = true
    startPos = window.mp.start;
    endPos = window.mp.end;
    window.dispatchEvent(zoomChangeEvt)
    window.player = new Player(startPos.x, startPos.y, startPos, endPos);
    alignMaze()
    updateNavAssist()
    updateNavIndicators()
    configureScreenInteractionsMazeOverlay()
    setTimeout(() => {
        focusStart()
    }, 500)
    setTimeout(() => {
        window.navNotAllowed = false
    }, 1000)
}