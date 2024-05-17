async function revealAnswer() {
    window.answerRevealed = true;
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    document.getElementById("onscreen-nav").classList.remove("show-onscreen-nav")

    const pathFromLocation = [
        ...player.wayBackCorrectPath,
        ...mp.path.slice(mp.path.indexOf(player.wayBackCorrectPath[player.wayBackCorrectPath.length - 1]) + 1)
    ]
    for (let i = 0 ; i < pathFromLocation.length ; i++) {
        dot = pathFromLocation[i]
        if (![mp.start, mp.end].includes(dot)) {
            window.player.moveBy(dot.x - player.x, dot.y - player.y)
            await new Promise(r => setTimeout(r, 100))
        }
    }
    await new Promise(r => setTimeout(r, 200))
    window.player.currentElem.classList.remove("current-player")
    window.mazeSquares[`${window.player.x},${window.player.y}`].stopBlink()
    mp.path.forEach((dot) => {
        dot.setColor("rgba(0, 50, 200, .5)");
    });
    mp.start.setColor("rgba(0, 200, 0, .5)");
    mp.end.setColor("rgba(200, 0, 0, .5)");
}