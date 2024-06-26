const sp = new URLSearchParams(window.location.search)
const easy = "easy"
const medium = "medium"
const hard = "hard"
window.currentLevel = medium
window.gridSize = 49
window.zoom = 1.5
window.zoomChangeEvt = new Event("zoomChange")

if (sp.has("level")) {
    const level = sp.get("level")
    setCurrentLevel(level)
    switch (level) {
        case easy:
            window.gridSize = 25
            break
        case medium:
            window.gridSize = 49
            break
        case hard:
            window.gridSize = 69
            break
    }
}
configForGridSize(window.gridSize)
function setCurrentLevel(lvl) {
    window.currentLevel = lvl
    document.querySelectorAll("#levels-control > button").forEach(e => e.classList.remove("current-lvl"))
    document.getElementById(lvl).classList.add("current-lvl")
}
function configForGridSize(size) { // Example: size = 49 for 49x49 grid
    window.gridSize = size
    const mg = document.getElementById("maze-grid")
    const a = (size-.5)*10 + 10
    
    window.addEventListener("zoomChange", () => {
        mg.setAttribute("height", a*zoom)
        mg.setAttribute("width", a*zoom)
    })
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
            document.getElementById("msg").innerHTML = "<p style='color: red'>Invalid maze data</p><button style='width: 100%; background-color: black; color: white; padding: 5px; border: olive 1px solid; cursor: pointer' onclick='newMaze()'>New Maze</button>"
        }
    }, 100)
}
else {
    setTimeout(construct, 100)
}


if (sp.has("share-url")) {
    const shareURL = sp.get("share-url");
    if (shareURL.startsWith(`${window.location.host}/share?s=`) || shareURL.startsWith("mazes.jothin.tech/")) {
        document.getElementById("print-msg").innerText = shareURL
    }
}

a = new Date().getTime()
for (let i = 0; i < 10000000; i++) {i+1}
b = new Date().getTime()
const deviceIsFast = b - a < 15

if (!deviceIsFast) {
    document.getElementById("controls-new-maze-btn").innerText = "Maze Collection"
    document.getElementById("game-over-new-maze-btn").innerText = "Go to the Maze Collection"
}

function newMaze() {
    if (deviceIsFast) {
        window.location.href = `/2d/?level=${window.currentLevel}`
    }
    else {
        window.location.href = `https://mazes.jothin.tech/?level=${window.currentLevel}`
    }
}

function toLevel(lvl) {
    if (!deviceIsFast) {
        window.location.href = `https://mazes.jothin.tech/?level=${lvl}`
        return
    }
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

function alignMaze() {
    const mgbc = mg.getBoundingClientRect()
    const mbc = document.getElementById("main").getBoundingClientRect()
    if (mbc.height > mgbc.height) mg.style.transform = `translateY(${Math.abs(mbc.height - mgbc.height)/2}px)`
}
window.alignMazeTimeout = null;
window.alignMazeHandler = () => {
    if (window.alignMazeTimeout) {
        clearTimeout(window.alignMazeTimeout)
    }
    window.alignMazeTimeout = setTimeout(alignMaze, 500)
}
window.addEventListener("resize", window.alignMazeHandler)

function setZoom(z) {
    stopAllTransition()
    window.zoom = z
    window.dispatchEvent(zoomChangeEvt)
    alignMaze()
    document.getElementById("zoom-percent").innerText = `${Math.round(window.zoom*100/1.5).toString().padStart(3, "0")}%`
    setTimeout(resumeAllTransition, 1000)
}
const changeZoomBy = (z) => setZoom(window.zoom + z)
zoomIn = () => {
    if (window.zoom < 2) changeZoomBy(+.05)
}
zoomOut = () => {
    if (window.zoom > 1) changeZoomBy(-.05)
}
window.addEventListener("keypress", (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return
    switch (e.key) {
        case "+":
            zoomIn()
            break
        case "-":
            zoomOut()
            break
    }
})
