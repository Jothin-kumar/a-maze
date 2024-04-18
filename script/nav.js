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
        this.pathElems = []
        this.prevX = null
        this.prevY = null
    }
    moveBy(x, y) {
        if (canMove(this.x, this.y, this.x+x, this.y+y)) {
            this.prevX = this.x
            this.prevY = this.y
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
        updateNav()
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
        updateNav()
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
        case " ":
            e.preventDefault()  // Prevent spacebar from triggering the "click" event on the focused button
            document.getElementById("onscreen-nav-assist").focus()
            document.getElementById("onscreen-nav-assist").click()
            break;
    }
})

const navAssistBtn = document.getElementById("onscreen-nav-assist")
function enableNavAssist(func) {
    navAssistBtn.onclick = func
    navAssistBtn.removeAttribute("disabled")
}
function disableNavAssist() {
    navAssistBtn.setAttribute("disabled", "")
}
function updateNav() {
    const w = document.getElementById("onscreen-nav-w")
    const s = document.getElementById("onscreen-nav-s")
    const a = document.getElementById("onscreen-nav-a")
    const d = document.getElementById("onscreen-nav-d")

    const x = window.player.x
    const y = window.player.y

    const possibleMoves = []
    
    if (!canMove(x, y, x, y-1)) {
        w.setAttribute("disabled", "")
    }
    else {
        w.removeAttribute("disabled")
        possibleMoves.push(w)
    }
    if (!canMove(x, y, x, y+1)) {
        s.setAttribute("disabled", "")
    }
    else {
        s.removeAttribute("disabled")
        possibleMoves.push(s)
    }
    if (!canMove(x, y, x-1, y)) {
        a.setAttribute("disabled", "")
    }
    else {
        a.removeAttribute("disabled")
        possibleMoves.push(a)
    }
    if (!canMove(x, y, x+1, y)) {
        d.setAttribute("disabled", "")
    }
    else {
        d.removeAttribute("disabled")
        possibleMoves.push(d)
    }

    if (possibleMoves.length === 1) {
        enableNavAssist(possibleMoves[0].onclick)
    }
    else if (possibleMoves.length == 2) {
        function isPrevPos(pm) {
            switch (pm) {
                case w:
                    return (player.prevX === player.x &&player.prevY === player.y-1)
                case s:
                    return (player.prevX === player.x &&player.prevY === player.y+1)
                case a:
                    return (player.prevX === player.x-1 &&player.prevY === player.y)
                case d:
                    return (player.prevX === player.x+1 &&player.prevY === player.y)
            }
        }
        if (isPrevPos(possibleMoves[0])) {
            enableNavAssist(possibleMoves[1].onclick)
        }
        else if (isPrevPos(possibleMoves[1])) {
            enableNavAssist(possibleMoves[0].onclick)
        }
        else {
            disableNavAssist()
        }
    }
    else {
        disableNavAssist()
    }
}