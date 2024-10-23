function gameOver(steps, startTime) {
    document.getElementById("maze-overlay").style.display = "none";
    let score = mp.path.length / (steps+2);
    score = (score*getDifficulty()).toFixed(0);
    window.gameIsOver = true;
    const main = document.getElementById("main");
    main.style.display = "none";
    player.reset()
    document.getElementById("controls").style.display = "none";
    document.getElementById("game-over").innerHTML = `<strong style="font-size: x-large">Game Over</strong><br><br>Score: ${score}<br>Time taken: ${((new Date().getTime() - startTime)/1000).toFixed(2)}s`;
    document.getElementById("game-over-parent").style.display = "block";
    deleteCookie("shared-maze-id");
    deleteCookie("maze-collection-id");
    deleteCookie("share-url");
}