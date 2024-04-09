function exportMaze() {
    const hiddenLines = Object.keys(window.lines).filter(key => window.lines[key].hidden);
    const correctPathElems = mp.path.filter(sq => ![mp.start, mp.end].includes(sq));
    const correctPathSquares = correctPathElems.map(sq => `${sq.x},${sq.y}`);

    return JSON.stringify({
        start: `${mp.start.x},${mp.start.y}`,
        end: `${mp.end.x},${mp.end.y}`,
        correctPathSquares: correctPathSquares,
        hiddenLines: hiddenLines
    })
}

function loadMazeFromShared(data) {
    const maze = JSON.parse(data);
    mp.start = window.mazeSquares[maze.start];
    mp.end = window.mazeSquares[maze.end];
    mp.path = maze.correctPathSquares.map(c => window.mazeSquares[c]);

    for (let i = 0; i < maze.hiddenLines.length; i++) {
        window.lines[maze.hiddenLines[i]].hide();
    }

    postConstruct()
}

function shareMaze(button) {
    const data = exportMaze();
    const url = new URL(window.location);
    url.searchParams.set("maze-data", data);
    navigator.clipboard.writeText(url.href);
    const originalText = button.innerText;
    button.innerText = "Copied!";
    setTimeout(() => button.innerText = originalText, 2500);
}
