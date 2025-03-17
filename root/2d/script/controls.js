const hideControlsBtn = document.getElementById("hide-controls-btn")
const hideControlsBtnSpan = document.querySelector("#hide-controls-btn > span")
window.controlsHidden = false

function switchControlVisibility() {
    const fullscreenBtn = document.getElementById("fullscreen-btn")
    const profileWidget = document.getElementById("profile-widget")
    if (window.controlsHidden) {
        hideControlsBtnSpan.innerHTML = "expand_circle_down"
        controls.style.display = "flex"
        fullscreenBtn.style.display = "inline-block"
        profileWidget.style.display = "block"
    }
    else {
        hideControlsBtnSpan.innerHTML = "expand_circle_up"
        controls.style.display = "none"
        fullscreenBtn.style.display = "none"
        profileWidget.style.display = "none"
    }
    window.controlsHidden = !window.controlsHidden
    adjustNavAssistPosition()
}
hideControlsBtn.addEventListener("click", switchControlVisibility)
document.addEventListener("keydown", (e) => {
    if (["c", "C"].includes(e.key)) {
        switchControlVisibility()
    }
})