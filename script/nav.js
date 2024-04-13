canMove = (x1, y1, x2, y2) => window.lines[`${x1+x2},${y1+y2}`].hidden

class Player {
    constructor(x, y, startPos, endPos) {
        this.x = x;
        this.y = y;
        this.startPos = startPos
        this.endPos = endPos;
        this.steps = 0
        this.pathElems = []
    }
    moveBy(x, y) {
        if (canMove(this.x, this.y, this.x+x, this.y+y)) {
            this.x += x;
            this.y += y;
            this.steps += 1
            let currentElem = window.mazeSquares[`${this.x},${this.y}`].elem
            if (this.pathElems.includes(currentElem)) {
                this.pathElems.forEach((elem) => {
                    elem.setAttribute("fill", "black")
                })
                this.pathElems = [currentElem]
            }
            else {
                this.pathElems.push(currentElem)
            }
            this.pathElems.push()
            this.pathElems.forEach((elem) => {
                let i = this.pathElems.indexOf(elem)
                let l = this.pathElems.length
                if (elem === this.startPos.elem) {}
                else {
                    let transperancy = 1 - (l-i)*.05
                    if (transperancy < 0) {
                        transperancy = 0
                    }
                    elem.setAttribute("fill", `rgba(200, 200, 255, ${transperancy})`)
                }
            })
        }
        if (this.steps === 1) {
            this.start = new Date().getTime()
        }
        if (this.x == this.endPos.x && this.y == this.endPos.y) {
            gameOver(this.steps, this.start)
        }
    }
    moveUp() {this.moveBy(0, -1)}
    moveDown() {this.moveBy(0, 1)}
    moveLeft() {this.moveBy(-1, 0)}
    moveRight() {this.moveBy(1, 0)}
    reset() {
        this.x = this.startPos.x
        this.y = this.startPos.y
        this.pathElems = []
        for (let key in window.mazeSquares) {
            window.mazeSquares[key].elem.setAttribute("fill", "black");
        }
        this.startPos.elem.setAttribute("fill", "green");
        this.endPos.elem.setAttribute("fill", "red");
        this.steps = 0
    }
}

window.addEventListener("keydown", (e) => {
    if (window.answerRevealed || window.gameIsOver) {
        return
    }
    const w = document.getElementById("onscreen-nav-w")
    const s = document.getElementById("onscreen-nav-s")
    const a = document.getElementById("onscreen-nav-a")
    const d = document.getElementById("onscreen-nav-d")
    switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
            w.focus()
            w.click()
            break;
        case "s":
        case "S":
        case "ArrowDown":
            s.focus()
            s.click()
            break;
        case "a":
        case "A":
        case "ArrowLeft":
            a.focus()
            a.click()
            break;
        case "d":
        case "D":
        case "ArrowRight":
            d.focus()
            d.click()
            break;
    }
})