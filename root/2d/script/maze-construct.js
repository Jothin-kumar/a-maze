window.mazeSquares = {}

class MazeSquare {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.used = false;
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.elem.setAttribute('width', 10);
        this.elem.setAttribute('height', 10);
        this.elem.setAttribute('x', x*10-5);
        this.elem.setAttribute('y', y*10-5);
        this.elem.setAttribute('fill', 'black');
        window.mg.appendChild(this.elem);
        window.mazeSquares[`${x},${y}`] = this;
        this.blink = false;
    }
    setColor(color) {
        this.elem.setAttribute('fill', color);
    }
    async startBlink () {
        this.blink = true;
        while (this.blink) {
            this.elem.style.opacity = 1;
            await new Promise(r => setTimeout(r, 500));
            if (this.blink) {this.elem.style.opacity = 0;}
            await new Promise(r => setTimeout(r, 200));
        }
    }
    stopBlink () {
        this.blink = false;
        this.elem.style.opacity = 1;
    }
}

const mg = window.mg = document.getElementById('maze-grid');

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
        if (this.path.length > 256) {
            throw new PathInvalidError("Path too long");
        }
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
        try {
            let neighbors = getUnusedNeighbors(path.path[path.path.length-1]);
            if (Object.keys(neighbors).length === 0) {
                path.path[path.path.length-1].type = "prohibited";
                path.path.pop();
            }
            else {
                choosen = pickRandomElement(Object.values(neighbors));
                if (!condition(choosen)) {
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
        catch (e) {
            console.warn(e);
            console.log("resetting...");
            path.reset();
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
    for (let x = 1; x < window.gridSize + 1; x++) {
        for (let y = 1; y < window.gridSize + 1; y++) {
            new MazeSquare(x, y);
        }
    }
    for (let x = 1; x < window.gridSize + 1; x++) {
        for (let y = 1; y < window.gridSize + 1; y++) {
            new Line(x, y, x+1, y);
            new Line(x, y, x, y+1);
        }
    }
}
function update(msg) {
    document.getElementById("caption").innerHTML = msg;

}
async function construct() {
    preConstruct();
    document.getElementById("main").style.display = "block"
    document.getElementById("loading").style.display = "none"
    const vals = {
        25: [69, 88, 10, 34, 20],
        49: [169, 175, 50, 169, 25],
        69: [200, 256, 69, 200, 88]
    }
    const val = vals[window.gridSize]
    window.mp = constructPath(pickRandomElement(Object.values(window.mazeSquares)), randRange(val[0], val[1])); // Main path
    await pathLine(mp.path);
    mp.start.setColor("green");
    mp.end.setColor("red");
    await new Promise(r => setTimeout(r, 1000));
    update("Correct path constructed<br>Constructing other paths...")
    while (Object.values(window.mazeSquares).filter((d) => !d.used).length > 0 && c < 10000) {
        await pathLine(constructPath(pickRandomElement(mp.path), randRange(val[2], val[3]), (dot) => !dot.used).path)
        await pathLine(constructPath(pickRandomElement(Object.values(window.mazeSquares).filter((d) => !d.used)), randRange(val[2], val[4]), (dot) => !dot.used).path);
        c++;
    }
    await new Promise(r => setTimeout(r, 500));
    update("All paths constructed<br>Removing unused squares...")
    await postConstruct();
    update(`Done ✅<br>Difficulty Rating: ${getDifficulty().toFixed(2)}`)
}
async function postConstruct() {
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
    for (let i = 0; i < toClear.length; i++) {
        d = toClear[i];
        async function handler (x, y) {
            if (toClear.includes(window.mazeSquares[`${d.x+x},${d.y+y}`])) {
                clearLine(d.x, d.y, d.x+x, d.y+y);
                window.lines[`${d.x*2+x},${d.y*2+y}`].ignore = true;
                await new Promise(r => setTimeout(r, 1));
            }
        }
        await handler(1, 0);
        await handler(0, 1);
        await handler(-1, 0);
        await handler(0, -1);
    };

    mp.start.setColor("green");
    mp.end.setColor("red");
    document.getElementById("main").style.display = "block"
    // document.getElementById("controls").style.display = "block"
    document.getElementById("loading").style.display = "none"
    // document.getElementById("onscreen-nav").classList.add("show-onscreen-nav")
    focusStart()
    startPos = window.mp.start;
    endPos = window.mp.end;
    window.player = new Player(startPos.x, startPos.y, startPos, endPos);
    updateNav()
    setTimeout(() => {
        adjustOnscreenNav()
    }, 500)
}