const sp = new URLSearchParams(window.location.search)
const easy = "easy"
const medium = "medium"
const hard = "hard"
window.currentLevel = medium
window.gridSize = 49

if (sp.has("level")) {
    const level = sp.get("level")
    setCurrentLevel(level)
    switch (level) {
        case easy:
            configForGridSize(25)
            break
        case medium:
            configForGridSize(49)
            break
        case hard:
            configForGridSize(69)
            break
    }
}
function toLevel(lvl) {
    if (lvl === window.currentLevel) return
    const usp = new URLSearchParams("")
    switch (lvl) {
        case easy:
            usp.set("level", easy)
            break
        case medium:
            usp.set("level", medium)
            break
        case hard:
            usp.set("level", hard)
            break
    }
    window.location.search = usp.toString()
}
function setCurrentLevel(lvl) {
    window.currentLevel = lvl
    document.querySelectorAll("#levels-control > button").forEach(e => e.classList.remove("current-lvl"))
    document.getElementById(lvl).classList.add("current-lvl")
}
function configForGridSize(size) { // Example: size = 49 for 49x49 grid
    window.gridSize = size
    const mg = document.getElementById("maze-grid")
    const a = size*10 + 10
    mg.setAttribute("height", a)
    mg.setAttribute("width", a)
    const b = a - 5
    document.getElementById("maze-grid-line-1").setAttribute("x2", b)
    document.getElementById("maze-grid-line-2").setAttribute("y1", b)
    document.getElementById("maze-grid-line-2").setAttribute("x2", b)
    document.getElementById("maze-grid-line-2").setAttribute("y2", b)
    document.getElementById("maze-grid-line-3").setAttribute("y2", b)
    document.getElementById("maze-grid-line-4").setAttribute("x1", b)
    document.getElementById("maze-grid-line-4").setAttribute("y2", b)
    document.getElementById("maze-grid-line-4").setAttribute("x2", b)

}


if (sp.has("maze-data")) {
    setTimeout(() => {
        try {
            loadMazeFromShared(sp.get("maze-data"))
        }
        catch (e) {
            console.error(e)
            document.getElementById("loading").style.display = "none"
            document.getElementById("msg").style.display = "block"
            document.getElementById("msg").innerHTML = "<p style='color: red'>Invalid maze data</p><button style='width: 100%; background-color: black; color: white; padding: 5px; border: olive 1px solid; cursor: pointer' onclick='window.location = window.location.pathname'>New Maze</button>"
        }
    }, 100)
}
else {
    a = new Date().getTime()
    for (let i = 0; i < 10000000; i++) {i+1}
    b = new Date().getTime()
    if (b - a < 15) {
        setTimeout(construct, 100)
    }
    else {
        document.getElementById("loading").style.display = "none"
        document.getElementById("msg").style.display = "block"
        document.getElementById("msg").innerHTML = "<p>Redirecting to maze collection...</p>"
        setTimeout(() => {
            window.location.href = "https://mazes.jothin.tech"
        }, 3000)
    }
}


if (sp.has("share-url")) {
    const shareURL = sp.get("share-url");
    if (shareURL.startsWith("a-maze.jothin.tech/share?s=") || shareURL.startsWith("mazes.jothin.tech/@")) {
        document.getElementById("print-msg").innerText = shareURL
    }
}

function newMaze() {
    window.location.href = `https://a-maze.jothin.tech/?level=${window.currentLevel}`
}