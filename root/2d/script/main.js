const sp = new CookieManager()
const easy = "easy"
const medium = "medium"
const hard = "hard"
window.currentLevel = easy
window.gridSize = 25
window.zoomChangeEvt = new Event("zoomChange")
history.pushState({}, "", "/");

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
        window.zoom = h/((window.gridSize-.5)*10 + 10)
    }
    else { // Landscape
        window.zoom = w/((window.gridSize-.5)*10 + 10)
    }
    setZoom(window.zoom)
}

window.gameCount = 0
if (sp.has("maze-collection-id") || sp.has("shared-maze-id")) {
    playNewMaze()
}
function A_Maze_main() {
    history.pushState({}, "", "/");
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
                    const mazeID = sp.get("shared-maze-id")
                    r = await getMazeData(mazeID)
                    lvl = r.lvl
                    data = r.data
                    history.pushState({}, "", "/share?id=" + mazeID);
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

function setZoom(z) {
    stopAllTransition()
    window.zoom = z
    window.dispatchEvent(zoomChangeEvt)
    alignMaze()
    setTimeout(resumeAllTransition, 1000)
}
