function getDifficulty() {
    var difficulty = 0;
    function movableNeighbours(dot) {
        const neighbors = [];
        function handler(x, y) {
            let potentialMovableNeighbor = window.mazeSquares[`${dot.x+x},${dot.y+y}`];
            if (potentialMovableNeighbor && canMove(dot.x, dot.y, dot.x + x, dot.y + y)) {
                neighbors.push(potentialMovableNeighbor);
            }
        }
        [[1, 0], [-1, 0] ,[0, 1], [0, -1]].forEach(([x, y]) => handler(x, y));
        return neighbors;
    }
    const correctPathList = Object.values(window.mp.path)
    for (let i = 0; i < correctPathList.length; i++) {
        let dot = correctPathList[i];
        let neighbors = movableNeighbours(dot);
        difficulty += neighbors.length - 2;
    }
    
    difficulty *= Object.values(lines).filter(l => l.hidden).length / Object.values(lines).length;
    return difficulty;
}