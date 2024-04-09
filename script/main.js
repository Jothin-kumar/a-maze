const sp = new URLSearchParams(window.location.search)
if (sp.has("maze-data")) {
    setTimeout(() => {
        try {
            loadMazeFromShared(sp.get("maze-data"))
        }
        catch (e) {
            console.error(e)
            document.getElementById("loading").style.display = "none"
            document.getElementById("error-msg").style.display = "block"
            document.getElementById("error-msg").innerHTML = "<p style='color: red'>Invalid maze data</p><button style='width: 100%; background-color: black; color: white; padding: 5px; border: olive 1px solid; cursor: pointer' onclick='window.location = window.location.pathname'>New Maze</button>"
        }
    }, 100)
}
else {
    setTimeout(construct, 100)
}
if (sp.has("share-url")) {
    const shareURL = sp.get("share-url");
    if (shareURL.startsWith("a-maze.jothin.tech/share?s=") || shareURL.startsWith("mazes.jothin.tech/@")) {
        document.getElementById("print-msg").innerText = shareURL
    }
}