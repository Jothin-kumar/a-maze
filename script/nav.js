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
                    elem.setAttribute("fill", `rgba(0, 0, 255, ${transperancy})`)
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
startPos = window.mp.start;
endPos = window.mp.end;
window.player = new Player(startPos.x, startPos.y, startPos, endPos);

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