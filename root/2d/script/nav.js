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
    moveBy(x, y, by='player') {
        if (by !== 'reveal-answer' &&(window.answerRevealed || window.gameIsOver || window.navNotAllowed)) {
            return
        }
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
        updateNavAssist()
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
        navAssistStop()
        updateNavAssist()
    }
}

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.altKey || e.shiftKey) return
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
            navAssistInit()
            break;
        case "f":
        case "F":
            toFullscreen()
            break;
    }
})
window.addEventListener("keyup", (e) => {
    if (e.ctrlKey || e.altKey || e.shiftKey) return
    switch (e.key) {
        case " ":
            navAssistStop()
            break;
    }
})


window.navAssistInUse = false
window.navAssistCoordBy = null
async function navAssist() {
    while (true) {
        if (window.navAssistInUse && !window.answerRevealed && !window.gameIsOver && !window.navNotAllowed) {
            if (window.navAssistCoordBy) {
                const [dx, dy] = window.navAssistCoordBy
                window.player.moveBy(dx, dy)
            }
        }
        await new Promise(r => setTimeout(r, 500))
    }
}
setTimeout(navAssist, 0)
function navAssistInit() {
    window.navAssistInUse = true
    navAssistBtn.classList.add('active')
}
function navAssistStop() {
    window.navAssistInUse = false
    navAssistBtn.classList.remove('active')
}
function displayNavAssist() {
    navAssistBtn.style.display = "block"
}
function hideNavAssist(by="") {
    window.navAssistHiddenBy = by
    navAssistBtn.style.display = "none"
}
function isNavAssistHidden() {
    return navAssistBtn.style.display === "none"
}

function getMovableNeighbours(dot) {
    const possibleMoves = [];
    [[0, +1], [0, -1], [+1, 0], [-1, 0]].forEach(([dx, dy]) => {
        if (canMove(dot.x, dot.y, dot.x+dx, dot.y+dy)) {
            possibleMoves.push([dx, dy])
        }
    })
    return possibleMoves
}
function isPrevPos(coordBy) {
    const [dx, dy] = coordBy
    return player.prevX == player.x+dx && player.prevY == player.y+dy
}
function updateNavAssist() {
    const possibleMoves = getMovableNeighbours(player)

    if (possibleMoves.length === 1) {
        window.navAssistCoordBy = possibleMoves[0]
    }
    else if (possibleMoves.length == 2) {
        if (isPrevPos(possibleMoves[0])) {
            window.navAssistCoordBy = possibleMoves[1]
        }
        else if (isPrevPos(possibleMoves[1])) {
            window.navAssistCoordBy = possibleMoves[0]
        }
    }
    else {
        const pm2 = possibleMoves.filter(([dx, dy]) => getMovableNeighbours({x: player.x+dx, y: player.y+dy}).length > 1)
        if (pm2.length === 1) {
            window.navAssistCoordBy = pm2[0]
        }
        else if (pm2.length == 2) {
            if (isPrevPos(pm2[0])) {
                window.navAssistCoordBy = pm2[1]
            }
            else if (isPrevPos(pm2[1])) {
                window.navAssistCoordBy = pm2[0]
            }
        }
        else {
            window.navAssistCoordBy = null
        }
    }
}
