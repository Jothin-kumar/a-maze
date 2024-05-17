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
    
    // Validation
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

    postConstruct()
}

async function shareMaze(button) {
    const originalText = button.innerText;

    if (window.shareURL) {
        finish(window.shareURL);
        return
    }
    const usp = new URLSearchParams(window.location.search);
    if (usp.has("share-url")) {
        const shareURL = usp.get("share-url");
        if (shareURL.startsWith(`joth.in/maze`) || shareURL.startsWith("mazes.jothin.tech/")) {
            finish("https://" + shareURL);
            return
        }
    }

    const data = exportMaze();
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
        const r = await fetch("https://share-maze.jothin.tech/new", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "maze-data": data,
                "level": usp.get("level") || "medium"
            }
        });
        const mazeID = await r.text();
        const url = `https://joth.in/maze?id=${mazeID}`;
        finish(url)
    }
    catch (e) {
        button.innerText = "Error. Try again Later";
        setTimeout(() => button.innerText = originalText, 2500);
    }
    function finish(url) {
        try {
            window.shareURL = url;
            document.getElementById("print-msg").innerText = url
            navigator.clipboard.writeText(url);
            button.innerText = "Copied!";
            setTimeout(() => button.innerText = originalText, 2500);
        }
        catch {
            document.getElementById("share-url-a").innerText = url;
            document.getElementById("share-url-a").setAttribute("href", url);
            document.getElementById("share-url").style.display = "block";
            setTimeout(() => button.innerText = originalText, 2500);
        }
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