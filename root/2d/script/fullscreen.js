const fullscreenBtn = document.getElementById("fullscreen-btn")
fullscreenBtn.addEventListener("click", function() {
    document.body.requestFullscreen()
    .then(() => {
        fullscreenBtn.style.display = "none"
    })
})
document.addEventListener("fullscreenchange", function() {
    if (!document.fullscreenElement) {
        fullscreenBtn.style.display = "block"
    }
    else {
        fullscreenBtn.style.display = "none"
    }
})