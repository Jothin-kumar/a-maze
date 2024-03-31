canMove = (x1, y1, x2, y2) => window.lines[`${x1+x2},${y1+y2}`].hidden

class Player {
    constructor(x, y, endPos) {
        this.x = x;
        this.y = y;
        this.endPos = endPos;
        this.steps = 0
        this.prevElem = window.mazeSquares[`${x},${y}`].elem;
    }
    moveBy(x, y) {
        if (canMove(this.x, this.y, this.x+x, this.y+y)) {
            this.x += x;
            this.y += y;
            this.steps += 1
            this.prevElem.setAttribute("fill", "rgba(0, 0, 200, .25)");
            this.currentElem = window.mazeSquares[`${this.x},${this.y}`].elem
            this.currentElem.setAttribute("fill", "rgba(255, 255, 255, .25)");
            this.prevElem = this.currentElem
        }
        if (this.steps === 1) {
            this.start = new Date().getTime()
        }
        if (this.x == this.endPos.x && this.y == this.endPos.y) {
            gameOver(this.steps, this.start)
        }
    }
}
startPos = window.mp.start;
endPos = window.mp.end;
window.player = new Player(startPos.x, startPos.y, endPos);

window.addEventListener("keydown", (e) => {
    if (window.answerRevealed) {
        return
    }
    switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
            player.moveBy(0, -1);
            break;
        case "s":
        case "S":
        case "ArrowDown":
            player.moveBy(0, 1);
            break;
        case "a":
        case "A":
        case "ArrowLeft":
            player.moveBy(-1, 0);
            break;
        case "d":
        case "D":
        case "ArrowRight":
            player.moveBy(1, 0);
            break;
    }
})