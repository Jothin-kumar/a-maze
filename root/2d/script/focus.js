function elemInViewport(elem, sm) {
    const rect = elem.getBoundingClientRect();
    const main = document.getElementById("main");
    const mainRect = main.getBoundingClientRect();
    return (
        rect.top >= mainRect.top + sm &&
        rect.left >= mainRect.left + sm &&
        rect.bottom <= mainRect.bottom - sm &&
        rect.right <= mainRect.right - sm
    )
}
function focusElem(elem) {
    if (!elemInViewport(elem, 100)) {
        elem.style.scrollMargin = "100px";
        elem.scrollIntoView();
    }
}
function focusStart() {
    focusElem(window.mp.start.elem);
}
window.addEventListener("zoomChange", focusStart)

const controls = document.getElementById("controls")
function unfocusControls() {
    controls.style.opacity = .5
    if (window.controlsDisplayNoneTimeout) {
        clearTimeout(window.controlsDisplayNoneTimeout)
    }
    window.controlsDisplayNoneTimeout = setTimeout(() => {
        if (!window.gameIsOver) {
            controls.style.opacity = 1
        }
    }, 2500)
}
controls.addEventListener("mouseover", () => {
    controls.style.opacity = 1
    if (window.controlsDisplayNoneTimeout) {
        clearTimeout(window.controlsDisplayNoneTimeout)
    }
})
controls.addEventListener("touchstart", () => {
    controls.style.opacity = 1
    if (window.controlsDisplayNoneTimeout) {
        clearTimeout(window.controlsDisplayNoneTimeout)
    }
})
document.getElementById("main").addEventListener("scroll", unfocusControls)