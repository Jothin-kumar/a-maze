const hideControlsBtn = document.getElementById("hide-controls-btn")
const showControlsBtn = document.getElementById("show-controls-btn")
window.controlsHidden = false

function switchControlVisibility() {
    const fullscreenBtn = document.getElementById("fullscreen-btn")
    const profileWidget = document.getElementById("profile-widget")
    if (window.controlsHidden) {
        showControlsBtn.style.opacity = 0
        controls.style.display = "block"
        fullscreenBtn.style.display = "inline-block"
        profileWidget.style.display = "block"
    }
    else {
        showControlsBtn.style.opacity = 1
        controls.style.display = "none"
        fullscreenBtn.style.display = "none"
        profileWidget.style.display = "none"
    }
    window.controlsHidden = !window.controlsHidden
    adjustNavAssistPosition()
    optimizeZoom()
}
hideControlsBtn.addEventListener("click", switchControlVisibility)
showControlsBtn.addEventListener("click", switchControlVisibility)
document.addEventListener("keydown", (e) => {
    if (["c", "C"].includes(e.key)) {
        console.log("Switching control visibility");
        
        switchControlVisibility()
    }
})