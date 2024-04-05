async function revealAnswer() {
    window.answerRevealed = true;
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
    document.getElementById("onscreen-nav").classList.remove("show-onscreen-nav")

    player.reset()
    for (let i = 0 ; i < mp.path.length ; i++) {
        dot = mp.path[i]
        if (![mp.start, mp.end].includes(dot)) {
            window.player.moveBy(dot.x - player.x, dot.y - player.y)
            await new Promise(r => setTimeout(r, 169))
        }
    }
    await new Promise(r => setTimeout(r, 200))
    mp.path.forEach((dot) => {
        if (![mp.start, mp.end].includes(dot)) {
            dot.setColor("rgba(200, 200, 255, .9)");
        }
    });
}