// Format: start end correctPathSquares-hiddenLinesXExcess-hiddenLinesYExcess
// (without space)
// Every 2 consecutive alphabets represent a coordinate
// for hiddenLines, coordinate is half

const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
numToAlpha = (n) => alphabets[n-1];
alphaToNum = (a) => alphabets.indexOf(a) + 1;
coordToAlpha = (x, y) => numToAlpha(x) + numToAlpha(y);
alphaToCoord = (alpha) => [alphaToNum(alpha[0]), alphaToNum(alpha[1])];


function exportMaze() {
    const correctPathElems = mp.path.filter(sq => ![mp.start, mp.end].includes(sq));
    const hiddenLines = (Object.keys(window.lines).filter(k => window.lines[k].hidden).map(k => k.split(",").map(n => parseInt(n))));
    const hiddenLinesXExcess = hiddenLines.filter(l => l[0] % 2 == 1);
    const hiddenLinesYExcess = hiddenLines.filter(l => l[1] % 2 == 1);

    let compressedData =  `${coordToAlpha(mp.start.x, mp.start.y)}${coordToAlpha(mp.end.x, mp.end.y)}`
    compressedData += correctPathElems.map(sq => coordToAlpha(sq.x, sq.y)).join("")
    compressedData += `-${hiddenLinesXExcess.map(l => coordToAlpha((l[0]-1)/2, l[1]/2)).join("")}`
    compressedData += `-${hiddenLinesYExcess.map(l => coordToAlpha(l[0]/2, (l[1]-1)/2)).join("")}`
    return compressedData;
}

function loadMazeFromShared(data) {
    mp.start = window.mazeSquares[alphaToCoord(data.slice(0, 2)).join(",")];
    mp.end = window.mazeSquares[alphaToCoord(data.slice(2, 4)).join(",")];

    data = data.slice(4).split("-");

    mp.path = [mp.start];
    for (let i = 0; i < data[0].length; i += 2) {
        mp.path.push(window.mazeSquares[alphaToCoord(data[0].slice(i, i+2)).join(",")]);
    }
    mp.path.push(mp.end);

    for (let i = 0; i < data[1].length; i += 2) {
        window.lines[`${2*alphaToNum(data[1][i])+1},${2*alphaToNum(data[1][i+1])}`].hide();
    }
    for (let i = 0; i < data[2].length; i += 2) {
        window.lines[`${2*alphaToNum(data[2][i])},${2*alphaToNum(data[2][i+1])+1}`].hide();
    }

    postConstruct()
}

function shareMaze(button) {
    const data = exportMaze();
    const originalText = button.innerText;
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
                    callback(JSON.parse(xhr.responseText)["short_url"]);
                } else {
                    callback(false);
                }
            }
        };
        xhr.send(data);
    }

    try {
        shortenURL(`https://a-maze.jothin.tech/?maze-data=${data}`, (shortURL) => {
            if (!shortURL) {
                button.innerText = "Error.";
                setTimeout(() => button.innerText = originalText, 2500);
                return;
            }
            navigator.clipboard.writeText(shortURL);
            button.innerText = "Copied!";
            setTimeout(() => button.innerText = originalText, 2500);
        });
    }
    catch {
        button.innerText = "Error.";
        setTimeout(() => button.innerText = originalText, 2500);
    }
}
