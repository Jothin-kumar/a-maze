function playNewMaze() {
    document.getElementById("a-maze").style.opacity = "1"
    document.getElementById("maze-collection-integration").style.display = "none"
    document.getElementById("profile-widget").style.display = "block"
    document.getElementById("maze-overlay").style.display = "inline-block"
    document.getElementById("reset-btn").style.display = "inline-block"
    document.getElementById("reveal-answer").style.display = "inline-block"
    document.getElementById("maze-overlay").style.display = "block";
    document.getElementById("controls").style.display = "block";
    document.getElementById("game-over-parent").style.display = "none";
    window.gameIsOver = false;
    A_Maze_main()
}
