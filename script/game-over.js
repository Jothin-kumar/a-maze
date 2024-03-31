function gameOver(steps) {
    let score = mp.path.length / steps;
    if (score > 1) {
        score = 1;
    }
    score = (score*100).toFixed(2);
    document.getElementById("main").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("game-over").innerText = `Game Over\nScore: ${score}%`;
    document.getElementById("game-over-parent").style.display = "block";
}