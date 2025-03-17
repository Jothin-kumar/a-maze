function gameOver(steps, startTime, custommsg="") {
    let score = mp.path.length / (steps+2);
    score = (score*getDifficulty()).toFixed(0);
    window.gameIsOver = true;
    const main = document.getElementById("main");
    main.style.opacity = "0.1";
    hideNavAssist("game-over");
    player.reset()
    if (!window.controlsHidden) switchControlVisibility();
    document.getElementById("game-over").innerHTML = custommsg || `<strong style="font-size: x-large">Game Over</strong><br><br>Your Score: ${score}<br>Time taken: ${((new Date().getTime() - startTime)/1000).toFixed(2)}s`;
    document.getElementById("game-over-parent").style.display = "block";
    deleteCookie("shared-maze-id");
    deleteCookie("maze-collection-id");
    deleteCookie("share-url");
}