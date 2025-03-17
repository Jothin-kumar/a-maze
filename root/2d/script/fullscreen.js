const fullscreenBtn = document.getElementById("fullscreen-btn")
const fullscreenNotice = document.getElementById("fullscreen-notice")
fullscreenNotice.onclick = () => fullscreenBtn.click()

function toFullscreen() {
    document.body.requestFullscreen()
    .then(() => {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen_exit</span>'
    })
    fullscreenBtn.removeEventListener("click", toFullscreen)
    fullscreenBtn.addEventListener("click", toNormal)
    fullscreenNotice.style.display = "none"
    if (!window.controlsHidden) switchControlVisibility()
}
function toNormal() {
    document.exitFullscreen()
    .then(() => {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen</span>'
    })
    fullscreenBtn.removeEventListener("click", toNormal)
    fullscreenBtn.addEventListener("click", toFullscreen)
    fullscreenNotice.style.display = "block"
}

window.fslistener = fullscreenBtn.addEventListener("click", toFullscreen)

window.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen_exit</span>'
        fullscreenBtn.removeEventListener("click", toFullscreen)
        fullscreenBtn.addEventListener("click", toNormal)
        fullscreenNotice.style.display = "none"
    } else {
        fullscreenBtn.innerHTML = '<span id="fullscreen-toggle" class="material-symbols-outlined">fullscreen</span>'
        fullscreenBtn.removeEventListener("click", toNormal)
        fullscreenBtn.addEventListener("click", toFullscreen)
        fullscreenNotice.style.display = "block"
    }
    adjustNavAssistPosition()
})