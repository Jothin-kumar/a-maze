function revealAnswer() {
    window.answerRevealed = true;
    Object.values(window.mazeSquares).forEach((dot) => {
        dot.setColor("black");
    })
    mp.path.forEach((dot) => {
        dot.setColor("rgba(0, 255, 0, .25)");
    });
    mp.start.setColor("green");
    mp.end.setColor("red");
    document.getElementById("reset-btn").style.display = "none"
    document.getElementById("reveal-answer").style.display = "none"
}
setTimeout(construct, 100)
