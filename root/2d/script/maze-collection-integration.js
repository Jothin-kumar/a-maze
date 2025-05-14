function playNewMaze() {
    document.getElementById("a-maze").style.opacity = "1"
    document.getElementById("maze-collection-integration").style.display = "none"
    document.getElementById("reset-btn").style.display = "inline-block"
    document.getElementById("reveal-answer").style.display = "inline-block"
    document.getElementById("help-btn").style.display = "inline-block"
    document.getElementById("game-over").style.display = "none";
    window.gameIsOver = false;
    window.shareURL = null;
    window.answerRevealed = false;
    window.navIndicatorsDisabled = false;
    const usp = new CookieManager();
    if (usp.has("shared-maze-id")) {
        window.shareURL = "https://https://joth.in/maze?id=" + usp.get("shared-maze-id");
    }
    else if (usp.has("maze-collection-id")) {
        const id = usp.get("maze-collection-id");
        const level = usp.get("level");
        const shareSlug = level === "easy" ? `@${id}`: `${level}/@${id}`;
        window.shareURL = "https://mazes.jothin.tech/" + shareSlug;
    }
    A_Maze_main()
    displayNavAssist()
}
function summonMazeCollectionAgain() {
    deleteCookie("maze-collection-id")
    deleteCookie("shared-maze-id")
    history.pushState({}, "", "/");
    document.getElementById("a-maze").style.opacity = "0"
    document.getElementById("maze-collection-integration").style.display = "block"
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    document.getElementById("controls").style.display = "none"
    document.getElementById("game-over").style.display = "none"
    document.getElementById("main").style.opacity = "1"
    navAssistStop()
    hideNavAssist()
}

async function getMazeDataFromCollection(level, id) {
    const r = await fetch(`https://mazes.jothin.tech/maze/${level}/${id}.json`);
    return (await r.json())["maze-data"]
}
configureMazeClickCallback((level, id) => {
    const shareSlug = level === "easy" ? `@${id}`: `${level}/@${id}`;
    setCookie("level", level);
    setCookie("maze-collection-id", id);
    deleteCookie("shared-maze-id")
    playNewMaze()
})

function playRandomlyGeneratedMaze() {
    deleteCookie("shared-maze-id")
    deleteCookie("maze-collection-id")
    playNewMaze()
}