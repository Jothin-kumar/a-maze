const sp = new CookieManager()
const easy = "easy"
const medium = "medium"
const hard = "hard"
window.currentLevel = easy
window.gridSize = 25
window.zoomChangeEvt = new Event("zoomChange")

window.addEventListener("resize", optimizeZoom)
function setCurrentLevel(lvl) {
    window.currentLevel = lvl
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
function optimizeZoom() {
    const m = document.body.getBoundingClientRect()
    const h = m.height
    const w = m.width
    if (h > w) { // Portrait
        window.suggestedZoom = h/((window.gridSize-.5)*10 + 10)
    }
    else { // Landscape
        window.suggestedZoom = w/((window.gridSize-.5)*10 + 10)
    }
    window.zoom = parseFloat(getCookie(`zoom-${window.currentLevel}`)) || window.suggestedZoom
    setZoom(window.zoom, cookie=false)
    updateZoom()
}

window.gameCount = 0
if (sp.has("maze-collection-id") || sp.has("shared-maze-id")) {
    playNewMaze()
}
function A_Maze_main() {
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
    optimizeZoom()
    document.getElementById("loading").style.display = "block"
    document.getElementById("msg").style.display = "none"
    document.getElementById("main").style.display = "none"
    if (!window.controlsHidden) switchControlVisibility()
    if (sp.has("maze-collection-id") || sp.has("shared-maze-id")) {
        setTimeout(async () => {
            try {
                if (sp.has("maze-collection-id")) {
                    lvl = sp.get("level")
                    data = await getMazeDataFromCollection(lvl, sp.get("maze-collection-id"))
                }
                else if (sp.has("shared-maze-id")) {
                    r = await getMazeData(sp.get("shared-maze-id"))
                    lvl = r.lvl
                    data = r.data
                }
                setCurrentLevel(lvl)
                switch (lvl) {
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
                configForGridSize(window.gridSize)
                optimizeZoom()
                loadMazeFromShared(data)
            }
            catch (e) {
                console.error(e)
                document.getElementById("loading").style.display = "none"
                document.getElementById("msg").style.display = "block"
                document.getElementById("msg").innerHTML = "<p style='color: red'>Invalid maze data</p><button style='width: 100%; background-color: black; color: white; padding: 5px; border: olive 1px solid; cursor: pointer' onclick='summonMazeCollectionAgain()'>New Maze</button>"
            }
        }, 100)
    }
    else {
        setTimeout(construct, 100)
    }
    window.gameCount++
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

function updateZoom() {
    document.getElementById("zoom-percent").innerText = `${Math.round(window.zoom*100/1.5).toString().padStart(3, "0")}%`
}
function setZoom(z, cookie=true) {
    stopAllTransition()
    window.zoom = z
    window.dispatchEvent(zoomChangeEvt)
    alignMaze()
    updateZoom()
    setTimeout(resumeAllTransition, 1000)
    if (cookie) setCookie(`zoom-${window.currentLevel}`, window.zoom)
}
const changeZoomBy = (z) => setZoom(window.zoom + z)
zoomIn = () => {
    if (window.zoom < window.suggestedZoom*1.5) changeZoomBy(+.05)
}
zoomOut = () => {
    if (window.zoom > window.suggestedZoom*.5) changeZoomBy(-.05)
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
