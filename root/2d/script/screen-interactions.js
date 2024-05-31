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

// drag to move
const moveThrottleTime = 250
var lastMoveTime = Date.now();
function moveHandler(moveX, moveY) {
    if (Date.now() - lastMoveTime < moveThrottleTime) return;
    const absMoveX = Math.abs(moveX);
    const absMoveY = Math.abs(moveY);
    if (absMoveX > absMoveY) { // horizontal (left or right)
        if (moveX > 0) {
            window.player.moveRight();
        }
        else {
            window.player.moveLeft();
        }
        lastMoveTime = Date.now();
    }
    else if (absMoveY > absMoveX) { // vertical (up or down)
        if (moveY > 0) {
            window.player.moveDown();
        }
        else {
            window.player.moveUp();
        }
        lastMoveTime = Date.now();
    }
}
addEventListener("mousemove", (e) => {
    if (!recentlyClicked && isMoving) {
        moveHandler(e.movementX, e.movementY);
    }
})
addEventListener("touchmove", (e) => {
    if (!recentlyClicked && isMoving) {
        moveHandler(e.touches[0].clientX - lastTouchX, e.touches[0].clientY - lastTouchY);
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
})