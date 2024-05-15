function getDifficulty() {
    var difficulty = 0;
    const correctPathList = Object.values(window.mp.path)
    for (let i = 0; i < correctPathList.length; i++) {
        let dot = correctPathList[i];
        let neighbors = movableNeighbours(dot);
        difficulty += neighbors.length - 2;
    }
    
    difficulty *= Object.values(lines).filter(l => l.hidden && !l.ignore).length / Object.values(lines).length;
    return difficulty;
}