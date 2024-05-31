canMove = (x1, y1, x2, y2) => {
    try {
        return window.lines[`${x1+x2},${y1+y2}`].hidden
    }
    catch {
        return false
    }
}

class Player {
    constructor(x, y, startPos, endPos) {
        this.x = x;
        this.y = y;
        this.startPos = startPos
        this.endPos = endPos;
        this.steps = 0
        this.currentElem = startPos.elem
        this.prevX = startPos.x
        this.prevY = startPos.y
        this.startPos.startBlink()
        this.startPos.elem.classList.add("current-player")
        this.wayBackCorrectPath = [this.startPos]
        this.endPositions = [
            this.endPos,
            ...[[1, 0], [0, 1], [-1, 0], [0, -1]]
            .filter(([dx, dy]) => canMove(this.endPos.x, this.endPos.y, this.endPos.x+dx, this.endPos.y+dy))
            .map(([dx, dy]) => window.mazeSquares[`${this.endPos.x+dx},${this.endPos.y+dy}`])
        ]
    }
    moveBy(x, y) {
        if (canMove(this.x, this.y, this.x+x, this.y+y)) {
            this.prevX = this.x
            this.prevY = this.y
            this.currentElem.classList.remove("current-player")
            window.mazeSquares[`${this.prevX},${this.prevY}`].stopBlink()
            this.x += x;
            this.y += y;
            this.steps += 1
            const currentPos = window.mazeSquares[`${this.x},${this.y}`]
            this.currentElem = currentPos.elem
            this.currentElem.classList.add("current-player")
            currentPos.startBlink()

            if (window.mp.path.includes(currentPos)) {
                this.wayBackCorrectPath = [currentPos]
            }
            else {
                if (this.wayBackCorrectPath.includes(currentPos)) {
                    this.wayBackCorrectPath = this.wayBackCorrectPath.slice(this.wayBackCorrectPath.indexOf(currentPos))
                }
                else {
                    this.wayBackCorrectPath = [currentPos, ...this.wayBackCorrectPath]
                }
            }
        }
        if (this.steps === 1) {
            this.start = new Date().getTime()
        }
        if (this.endPositions.includes(window.mazeSquares[`${this.x},${this.y}`]) && !window.answerRevealed) {
            gameOver(this.steps, this.start)
        }
        focusElem(this.currentElem)
        unfocusControls()
    }
    moveUp() {this.moveBy(0, -1)}
    moveDown() {this.moveBy(0, 1)}
    moveLeft() {this.moveBy(-1, 0)}
    moveRight() {this.moveBy(1, 0)}
    reset() {
        this.currentElem.classList.remove("current-player")
        window.mazeSquares[`${this.prevX},${this.prevY}`].stopBlink()
        this.x = this.startPos.x
        this.y = this.startPos.y
        this.currentElem = startPos.elem
        for (let key in window.mazeSquares) {
            window.mazeSquares[key].elem.setAttribute("fill", "black");
        }
        this.endPos.elem.setAttribute("fill", "red");
        this.steps = 0
        this.startPos.startBlink()
        this.startPos.elem.classList.add("current-player")
    }
}

window.addEventListener("keydown", (e) => {
    if (window.answerRevealed || window.gameIsOver || window.navNotAllowed) {
        return
    }
    switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
            window.player.moveUp()
            break;
        case "s":
        case "S":
        case "ArrowDown":
            window.player.moveDown()
            break;
        case "a":
        case "A":
        case "ArrowLeft":
            window.player.moveLeft()
            break;
        case "d":
        case "D":
        case "ArrowRight":
            window.player.moveRight()
            break;
    }
})
