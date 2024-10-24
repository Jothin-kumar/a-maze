async function revealAnswer() {
    deleteCookie("shared-maze-id");
    deleteCookie("maze-collection-id");
    deleteCookie("share-url");
    const gc = window.gameCount
    document.getElementById("maze-overlay").style.display = "none";
    window.answerRevealed = true;
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    window.navIndicatorsDisabled = true

    const pathFromLocation = [
        ...player.wayBackCorrectPath,
        ...mp.path.slice(mp.path.indexOf(player.wayBackCorrectPath[player.wayBackCorrectPath.length - 1]) + 1)
    ]
    for (let i = 0 ; i < pathFromLocation.length ; i++) {
        dot = pathFromLocation[i]
        window.player.moveBy(dot.x - player.x, dot.y - player.y)
        await new Promise(r => setTimeout(r, 250))
        dot.displayIndicator()
        if (gc !== window.gameCount) return
    }
    await new Promise(r => setTimeout(r, 200))
    if (gc !== window.gameCount) return
    window.player.currentElem.classList.remove("current-player")
    window.mazeSquares[`${window.player.x},${window.player.y}`].stopBlink()
    for (let i = 0 ; i < mp.path.length ; i++) {
        dot = mp.path[i]
        dot.setColor("rgba(0, 50, 200, .5)");
        if (pathFromLocation.includes(dot)) {
            break;
        }
    };
    mp.start.setColor("rgba(0, 200, 0, .5)");
    mp.end.setColor("rgba(200, 0, 0, .5)");
    [mp.start, mp.end].forEach((dot) => {
        dot.hideIndicator()
    })
}