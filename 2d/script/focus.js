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

function unfocusControls() {
    const controls = document.getElementById("controls")
    controls.style.display = "none"
    if (window.controlsDisplayNoneTimeout) {
        clearTimeout(window.controlsDisplayNoneTimeout)
    }
    window.controlsDisplayNoneTimeout = setTimeout(() => {
        if (!window.gameIsOver) {
            controls.style.display = "block"
        }
    }, 2500)
}
document.getElementById("main").addEventListener("scroll", unfocusControls)