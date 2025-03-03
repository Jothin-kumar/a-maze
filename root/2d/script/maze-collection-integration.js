function playNewMaze() {
    document.getElementById("a-maze").style.opacity = "1"
    document.getElementById("maze-collection-integration").style.display = "none"
    document.getElementById("reset-btn").style.display = "inline-block"
    document.getElementById("reveal-answer").style.display = "inline-block"
    document.getElementById("controls").style.display = "block";
    document.getElementById("game-over-parent").style.display = "none";
    window.gameIsOver = false;
    window.shareURL = null;
    window.answerRevealed = false;
    window.navIndicatorsDisabled = false;
    const usp = new CookieManager();
    if (usp.has("share-url")) {
        window.shareURL = "https://" + usp.get("share-url").replace("equal_to", "=")
    }
    A_Maze_main()
    displayNavAssist()
}
function summonMazeCollectionAgain() {
    deleteCookie("maze-collection-id")
    deleteCookie("share-url")
    deleteCookie("shared-maze-id")
    document.getElementById("a-maze").style.opacity = "0"
    document.getElementById("maze-collection-integration").style.display = "block"
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    document.getElementById("controls").style.display = "none"
    document.getElementById("game-over-parent").style.display = "none"
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
    setCookie("share-url", `mazes.jothin.tech/${shareSlug}`);
    setCookie("level", level);
    setCookie("maze-collection-id", id);
    deleteCookie("shared-maze-id")
    playNewMaze()
})

function playRandomlyGeneratedMaze() {
    deleteCookie("shared-maze-id")
    deleteCookie("maze-collection-id")
    deleteCookie("share-url")
    playNewMaze()
}