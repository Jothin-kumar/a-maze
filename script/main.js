const sp = new URLSearchParams(window.location.search)
if (sp.has("maze-data")) {
    setTimeout(() => {
        loadMazeFromShared(sp.get("maze-data"))
    }, 100)
}
else {
    setTimeout(construct, 100)
}