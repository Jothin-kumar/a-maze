function playNewMaze() {
    document.getElementById("a-maze").style.opacity = "1"
    document.getElementById("maze-collection-integration").style.display = "none"
    document.getElementById("profile-widget").style.display = "block"
    document.getElementById("maze-overlay").style.display = "inline-block"
    document.getElementById("reset-btn").style.display = "inline-block"
    document.getElementById("reveal-answer").style.display = "inline-block"
    document.getElementById("maze-overlay").style.display = "block";
    document.getElementById("controls").style.display = "block";
    document.getElementById("game-over-parent").style.display = "none";
    window.gameIsOver = false;
    window.shareURL = null;
    A_Maze_main()
}
function summonMazeCollectionAgain() {
    document.getElementById("a-maze").style.opacity = "0"
    document.getElementById("maze-collection-integration").style.display = "block"
    document.getElementById("profile-widget").style.display = "none"
    document.getElementById("maze-overlay").style.display = "none"
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    document.getElementById("controls").style.display = "none"
    document.getElementById("game-over-parent").style.display = "none"
}

async function getMazeDataFromCollection(level, id) {
    const r = await fetch(`https://mazes.jothin.tech/maze/${level}/${id}.json`);
    return (await r.json())["maze-data"]
}
configureMazeClickCallback((level, id) => {
    const shareSlug = level === "easy" ? `@${id}`: `${level}/@${id}`;
    setCookie("share-url", `mazes.jothin.tech/${shareSlug}`);
    setCookie("level", level);
    setCookie("maze-collection-id", id);
    deleteCookie("shared-maze-id")
    playNewMaze()
})

function playRandomlyGeneratedMaze() {
    deleteCookie("maze-data")
    deleteCookie("share-url")
    playNewMaze()
}