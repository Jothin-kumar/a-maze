const hideControlsBtn = document.getElementById("hide-controls-btn")
const hideControlsBtnSpan = document.querySelector("#hide-controls-btn > span")
window.controlsHidden = false

function switchControlVisibility() {
    if (window.controlsHidden) {
        hideControlsBtnSpan.innerHTML = "expand_circle_down"
        controls.style.display = "flex"
    }
    else {
        hideControlsBtnSpan.innerHTML = "expand_circle_up"
        controls.style.display = "none"
    }
    window.controlsHidden = !window.controlsHidden
}
hideControlsBtn.addEventListener("click", switchControlVisibility)
document.addEventListener("keydown", (e) => {
    if (["c", "C"].includes(e.key)) {
        switchControlVisibility()
    }
})