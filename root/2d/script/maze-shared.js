// Format: start end correctPathSquares-hiddenLinesXExcess-hiddenLinesYExcess
// (without space)
// Every 2 consecutive encodeChrs represent a coordinate
// for hiddenLines, coordinate is half

const encodeChrs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!._$,()";
encodeFromNum = (n) => encodeChrs[n-1];
decodeToNum = (a) => encodeChrs.indexOf(a) + 1;
encodeFromCoords = (x, y) => encodeFromNum(x) + encodeFromNum(y);
decodeToCoords = (alpha) => [decodeToNum(alpha[0]), decodeToNum(alpha[1])];


function exportMaze() {
    const correctPathElems = mp.path.filter(sq => ![mp.start, mp.end].includes(sq));
    const hiddenLines = (Object.keys(window.lines).filter(k => window.lines[k].hidden && !window.lines[k].ignore).map(k => k.split(",").map(n => parseInt(n))));
    const hiddenLinesXExcess = hiddenLines.filter(l => l[0] % 2 == 1);
    const hiddenLinesYExcess = hiddenLines.filter(l => l[1] % 2 == 1);

    let compressedData =  `${encodeFromCoords(mp.start.x, mp.start.y)}${encodeFromCoords(mp.end.x, mp.end.y)}`
    compressedData += correctPathElems.map(sq => encodeFromCoords(sq.x, sq.y)).join("")
    compressedData += `-${hiddenLinesXExcess.map(l => encodeFromCoords((l[0]-1)/2, l[1]/2)).join("")}`
    compressedData += `-${hiddenLinesYExcess.map(l => encodeFromCoords(l[0]/2, (l[1]-1)/2)).join("")}`
    return compressedData;
}

function loadMazeFromShared(data) {
    preConstruct();
    window.mp = new Path(window.mazeSquares[decodeToCoords(data.slice(0, 2)).join(",")]);
    mp.end = window.mazeSquares[decodeToCoords(data.slice(2, 4)).join(",")];

    data = data.slice(4).split("-");

    mp.path = [mp.start];
    for (let i = 0; i < data[0].length; i += 2) {
        mp.path.push(window.mazeSquares[decodeToCoords(data[0].slice(i, i+2)).join(",")]);
    }
    mp.path.push(mp.end);
    
    // Validation - 1
    for (let i = 0; i < mp.path.length-1; i++) {
        if (Math.abs(mp.path[i].x - mp.path[i+1].x) + Math.abs(mp.path[i].y - mp.path[i+1].y) != 1) {
            throw "Invalid path"
        }
    }
    if (mp.path.length != new Set(mp.path).size) {
        throw "Repeated squares in path"
    }

    pathLine(mp.path);
    for (let i = 0; i < data[1].length; i += 2) {
        window.lines[`${2*decodeToNum(data[1][i])+1},${2*decodeToNum(data[1][i+1])}`].hide();
    }
    for (let i = 0; i < data[2].length; i += 2) {
        window.lines[`${2*decodeToNum(data[2][i])},${2*decodeToNum(data[2][i+1])+1}`].hide();
    }

    // Validation - 2
    function getNeighbouringLines(lineX, lineY) {
        if (lineX % 2 == 1 && lineY % 2 == 0) { // Vertical
            neighbours = [
                [lineX, lineY+2],
                [lineX, lineY-2],
            ]
        }
        else if (lineX % 2 == 0 && lineY % 2 == 1) { // Horizontal
            neighbours = [
                [lineX+2, lineY],
                [lineX-2, lineY],
            ]
        }
        else {
            throw `Invalid line: ${lineX},${lineY}`
        }
        neighbours.push(
            [lineX+1, lineY+1],
            [lineX+1, lineY-1],
            [lineX-1, lineY+1],
            [lineX-1, lineY-1],
        )

        return neighbours.map(n => window.lines[`${n[0]},${n[1]}`]).filter(n => n);
    }
    let connectedLines = []
    for (let i = 3; i < gridSize*2; i += 2) {
        connectedLines.push(
            [i, 2],
            [2, i],
            [i, gridSize*2],
            [gridSize*2, i],
        )
    }
    connectedLines = connectedLines.map(c => lines[c.join(",")]).filter(l => !l.hidden)
    function connectConnectableLines() {
        c = 0
        connectedLines.forEach(l => {
            getNeighbouringLines(l.x, l.y).forEach(nl => {
                if (nl.hidden) return
                if (connectedLines.includes(nl)) return
                connectedLines.push(nl)
                c++
            })
        })
        return c
    }
    c = 1
    while (c > 0) {
        c = connectConnectableLines()
    }
    Object.values(lines).filter(l => !l.hidden).forEach(l => {
        if (!connectedLines.includes(l)) {
            throw `Unconnected line: ${l.x},${l.y}`
        }
    })

    postConstruct()
}

async function getMazeID(data, lvl) {  // Get maze ID from server
    const r = await fetch("https://share-maze.jothin.tech/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "maze-data": data,
                "level": lvl
            })
        });
    const mazeID = await r.text();
    return mazeID;
}
async function loadMazeFromID(id) {  // Load maze from server
    const r = await fetch(`https://share-maze.jothin.tech/get?maze-id=${usp.get("id")}`)
    let mazeData = (await r.json())["output"]
    if (!mazeData) {
        declareInvalid()
        return
    }
    const lvl = {
        "e": "easy",
        "m": "medium",
        "h": "hard"
    }[mazeData[0]]
    if (!lvl) {
        declareInvalid()
        return
    }
    mazeData = mazeData.slice(1)
    return lvl, mazeData
}

async function shareMaze(button) {
    const originalText = button.innerText;

    if (window.shareURL) {
        finish(window.shareURL);
        return
    }
    const usp = new CookieManager();
    if (usp.has("share-url")) {
        const shareURL = usp.get("share-url");
        console.log(shareURL);
        
        finish("https://" + shareURL);
        return
    }

    button.innerText = "Exporting...";
    setTimeout(async () => {
        while (["Exporting.","Exporting..","Exporting..."].includes(button.innerText)) {
            switch (button.innerText) {
                case "Exporting...":
                    button.innerText = "Exporting.";
                    break;
                case "Exporting..":
                    button.innerText = "Exporting...";
                    break;
                case "Exporting.":
                    button.innerText = "Exporting..";
                    break;
                default:
                    break;
            }
            await new Promise(r => setTimeout(r, 1000));
        }
    }, 0);

    try {
        const mazeID = await getMazeID(exportMaze(), usp.get("level") || "easy");
        const url = `https://joth.in/maze?id=${mazeID}`;
        finish(url)
    }
    catch (e) {
        button.innerText = "Error. Try again Later";
        setTimeout(() => button.innerText = originalText, 2500);
    }
    function finish(url) {
        window.shareURL = url;
        navigator.clipboard.writeText(url).catch(() => {
            document.getElementById("share-url-a").innerText = url;
            document.getElementById("share-url-a").setAttribute("href", url);
            document.getElementById("share-url").style.display = "block";
            setTimeout(() => button.innerText = originalText, 2500);
        });
        button.innerText = "Copied!";
        setTimeout(() => button.innerText = originalText, 2500);
    }
}
document.addEventListener("click", (e) => {
    if (e.target.id === "share-url" || e.target.id === "share-url-a" || e.target.id === "share-url-h3") {
        return
    }
    document.getElementById("share-url").style.display = "none";
})
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.getElementById("share-url").style.display = "none";
    }
})