function configureScreenInteractionsMazeOverlay() {
    const overlay = document.getElementById("maze-overlay");
    const mainBCR = document.getElementById("main").getBoundingClientRect();
    overlay.style.width = mainBCR.width + "px";
    overlay.style.height = mainBCR.height + "px";
    overlay.style.top = mainBCR.top + "px";
    overlay.style.left = mainBCR.left + "px";
}
addEventListener("resize", configureScreenInteractionsMazeOverlay);
var isMoving = false;
var lastTouchX, lastTouchY;
["mousedown", "touchstart"].forEach(evt => addEventListener(evt, (e) => {
    isMoving = true
    lastTouchX = e.touches ? e.touches[0].clientX : undefined;
    lastTouchY = e.touches ? e.touches[0].clientY : undefined
}));
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
        main.scrollBy(-e.movementX, -e.movementY);
    }
    resetRecentlyClickedTimeout(100);
})
addEventListener("touchmove", (e) => {
    if (recentlyClicked && isMoving) {
        const main = document.getElementById("main");
        if (lastTouchX && lastTouchY) {
            main.scrollBy((lastTouchX - e.touches[0].clientX), (lastTouchY - e.touches[0].clientY));
        }
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
    resetRecentlyClickedTimeout(100);
})
