function gameOver(steps, startTime) {
    let score = mp.path.length / steps;
    if (score > 1) {
        score = 1;
    }
    score = (score*getDifficulty()).toFixed(2);
    window.gameIsOver = true;
    const main = document.getElementById("main");
    document.getElementById("game-over-maze-parent").appendChild(main);
    player.reset()
    document.getElementById("controls").style.display = "none";
    document.getElementById("game-over").innerHTML = `<strong style="font-size: x-large">Game Over</strong><br>Score: ${score}<br>Time taken: ${((new Date().getTime() - startTime)/1000).toFixed(2)}s`;
    document.getElementById("game-over-parent").style.display = "block";
    document.getElementById("onscreen-nav").classList.remove("show-onscreen-nav")
}