const fullscreenBtn = document.getElementById("fullscreen-btn")

function toFullscreen() {
    document.body.requestFullscreen()
    .then(() => {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen_exit</span>'
    })
    fullscreenBtn.removeEventListener("click", toFullscreen)
    fullscreenBtn.addEventListener("click", toNormal)
}
function toNormal() {
    document.exitFullscreen()
    .then(() => {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen</span>'
    })
    fullscreenBtn.removeEventListener("click", toNormal)
    fullscreenBtn.addEventListener("click", toFullscreen)
}

window.fslistener = fullscreenBtn.addEventListener("click", toFullscreen)

window.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen_exit</span>'
        fullscreenBtn.removeEventListener("click", toFullscreen)
        fullscreenBtn.addEventListener("click", toNormal)
    } else {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen</span>'
        fullscreenBtn.removeEventListener("click", toNormal)
        fullscreenBtn.addEventListener("click", toFullscreen)
    }
})