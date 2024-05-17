window.afterPrintEvtListener = () => {}
window.prePrintZoom = window.zoom
window.addEventListener("beforeprint", async function() {
    window.prePrintZoom = window.zoom
    window.removeEventListener("afterprint", window.afterPrintEvtListener)
    switch (window.currentLevel) {
        case easy:
            setZoom(2)
            break
        case medium:
            setZoom(1.5)
            break
        case hard:
            setZoom(1.1)
            break
    }
    window.afterPrintEvtListener = () => setZoom(window.prePrintZoom)
    window.addEventListener("afterprint", window.afterPrintEvtListener)

    const mazeID = await getMazeID(exportMaze(), window.currentLevel);
    const url = `https://joth.in/maze?id=${mazeID}`;
    window.shareURL = url;
    document.getElementById("print-msg").innerText = url
})