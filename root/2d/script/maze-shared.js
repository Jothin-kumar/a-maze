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

    for (let i = 0; i < data[1].length; i += 2) {
        window.lines[`${2*decodeToNum(data[1][i])+1},${2*decodeToNum(data[1][i+1])}`].hide();
    }
    for (let i = 0; i < data[2].length; i += 2) {
        window.lines[`${2*decodeToNum(data[2][i])},${2*decodeToNum(data[2][i+1])+1}`].hide();
    }


    // Corruption detection
    window.acceptedSquares = mp.path;
    function ConnectAllConnectableNeighbours() {
        let neighbours = [];
        for (let i = 0; i < acceptedSquares.length-1; i++) {
            neighbours.push(...movableNeighbours(acceptedSquares[i]));
        }
        neighbours = neighbours.filter(n => !acceptedSquares.includes(n));
        if (neighbours.length != 0) {
            window.acceptedSquares = [...acceptedSquares, ...neighbours];
            ConnectAllConnectableNeighbours();
        }
    }
    ConnectAllConnectableNeighbours();
    const allSquares = Object.values(window.mazeSquares);
    allSquares.forEach(sq => {
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]]
        .map(([x, y]) => canMove(sq.x, sq.y, sq.x + x, sq.y + y) && !acceptedSquares.includes(sq))
        .every(b => b)) {
            throw "Unreachable square"
        }
    })

    postConstruct()

}

function shareMaze(button) {
    const originalText = button.innerText;

    const usp = new URLSearchParams(window.location.search);
    if (usp.has("share-url")) {
        const shareURL = usp.get("share-url");
        if (shareURL.startsWith(`${window.location.host}/share?s=`) || shareURL.startsWith("mazes.jothin.tech/")) {
            finish("https://" + shareURL);
            return
        }
    }

    const data = exportMaze();
    button.innerText = "Exporting...";

    function shortenURL(url, callback) {
        const data = new URLSearchParams();
        data.append('url', url);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://spoo.me/', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(JSON.parse(xhr.responseText)["short_url"].replace("spoo.me/", `${window.location.host}/share?s=`));
                } else {
                    callback(false);
                }
            }
        };
        xhr.send(data);
    }

    const toBeShortenedURL = usp.has("level") ? `https://${window.location.host}/2d/?maze-data=${data}&level=${usp.get("level")}` : `https://${window.location.host}/2d/?maze-data=${data}`;

    try {
        shortenURL(toBeShortenedURL, (shortURL) => {
            if (!shortURL) {
                window.shortURL = toBeShortenedURL
            }
            finish(window.shortURL || shortURL)
        });
    }
    catch {
        finish(toBeShortenedURL)
    }
    function finish(url) {
        document.getElementById("print-msg").innerText = url
        navigator.clipboard.writeText(url);
        button.innerText = "Copied!";
        setTimeout(() => button.innerText = originalText, 2500);
    }
}
