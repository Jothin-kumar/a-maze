const fullscreenBtn = document.getElementById("fullscreen-btn")
fullscreenBtn.addEventListener("click", function() {
    document.body.requestFullscreen()
    .then(() => {
        fullscreenBtn.style.display = "none"
    })
})

window.addEventListener("resize", function() { // https://stackoverflow.com/a/22662650/15923012
    var maxHeight = window.screen.height,
        maxWidth = window.screen.width,
        curHeight = window.innerHeight,
        curWidth = window.innerWidth;

    if (maxWidth == curWidth && maxHeight == curHeight) {
        fullscreenBtn.style.display = "none"
    }
    else {
        fullscreenBtn.style.display = "block"
    }
})