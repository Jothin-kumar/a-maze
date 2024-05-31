function configureScreenInteractionsMazeOverlay() {
    const overlay = document.getElementById("maze-overlay");
    const mainBCR = document.getElementById("main").getBoundingClientRect();
    overlay.style.width = mainBCR.width + "px";
    overlay.style.height = mainBCR.height + "px";
    overlay.style.top = mainBCR.top + "px";
    overlay.style.left = mainBCR.left + "px";

    const mgBCR = document.getElementById("maze-grid").getBoundingClientRect();
    window.wRatio = 2*mgBCR.width / mainBCR.width;
    window.hRatio = 2*mgBCR.height / mainBCR.height;
}
addEventListener("resize", configureScreenInteractionsMazeOverlay);
var isMoving = false;
["mousedown", "touchstart"].forEach(evt => addEventListener(evt, () => isMoving = true));
["mouseup", "touchend"].forEach(evt => addEventListener(evt, () => isMoving = false));

// drag to move


// click and drag to scroll
var recentlyClicked = false;
var recentlyClickedTimeout;
function resetRecentlyClickedTimeout(t=1000) {
    clearTimeout(recentlyClickedTimeout);
    recentlyClickedTimeout = setTimeout(() => {
        recentlyClicked = false;
    }, t);
}
addEventListener("click", (e) => {
    recentlyClicked = true;
    resetRecentlyClickedTimeout();
})

addEventListener("mousemove", (e) => {
    if (recentlyClicked && isMoving) {
        const main = document.getElementById("main");
        main.scrollBy(-e.movementX*wRatio, -e.movementY*hRatio);
    }
    resetRecentlyClickedTimeout();
})
var lastTouchX, lastTouchY;
addEventListener("touchmove", (e) => {
    if (recentlyClicked && isMoving) {
        const main = document.getElementById("main");
        if (lastTouchX && lastTouchY) {
            main.scrollBy((lastTouchX - e.touches[0].clientX)*wRatio, (lastTouchY - e.touches[0].clientY)*hRatio);
        }
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
    resetRecentlyClickedTimeout();
})