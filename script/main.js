const sp = new URLSearchParams(window.location.search)
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