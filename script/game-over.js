function gameOver(steps, startTime) {
    let score = mp.path.length / steps;
    if (score > 1) {
        score = 1;
    }
    score = (score*100).toFixed(2);
    document.getElementById("main").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("game-over").innerText = `Game Over\nScore: ${score}%\nTime taken: ${((new Date().getTime() - startTime)/1000).toFixed(2)}s`;
    document.getElementById("game-over-parent").style.display = "block";
}