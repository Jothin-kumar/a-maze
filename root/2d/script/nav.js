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
        if (this.x == this.endPos.x && this.y == this.endPos.y && !window.answerRevealed) {
            gameOver(this.steps, this.start)
        }
        updateNav()
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
        updateNav()
    }
}

window.addEventListener("keydown", (e) => {
    if (window.answerRevealed || window.gameIsOver || window.navNotAllowed) {
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
        case " ":
            e.preventDefault()  // Prevent spacebar from triggering the "click" event on the focused button
            navAssistInit()
            break;
    }
})
window.addEventListener("keyup", (e) => {
    if (e.key === " " && window.navAssistUsed) {
        navAssistStop()
    }
})

const navAssistBtn = document.getElementById("onscreen-nav-assist")
navAssistBtn.held = false
async function navAssist() {
    while (navAssistBtn.held && !window.answerRevealed && !window.gameIsOver) {
        navAssistBtn.func()
        await new Promise(r => setTimeout(r, 256))
    }
}
function navAssistInit() {
    if (!navAssistBtn.held && !navAssistBtn.disabled) {
        navAssistBtn.held = true
        navAssist()
        navAssistBtn.style.backgroundColor = "rgb(0, 169, 69)"
    }
    else {
        window.navAssistUsed = true
    }
}
function navAssistStop() {
    window.navAssistUsed = false
    navAssistBtn.held = false
    navAssistBtn.style.backgroundColor = "rgb(0, 69, 169)"
}
function enableNavAssist(func) {
    navAssistBtn.func = () => {
        func()
        window.navAssistUsed = true
    }
}
function disableNavAssist() {
    navAssistBtn.func = () => {}
}
function switchNavAssist() {
    if (navAssistBtn.held) {
        navAssistStop()
    }
    else {
        navAssistInit()
    }
}
navAssistBtn.addEventListener("click", switchNavAssist)
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