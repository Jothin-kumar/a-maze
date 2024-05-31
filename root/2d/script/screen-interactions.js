const overlay = document.getElementById("maze-overlay");
function configureScreenInteractionsMazeOverlay() {
    const mainBCR = document.getElementById("main").getBoundingClientRect();
    overlay.style.width = mainBCR.width + "px";
    overlay.style.height = mainBCR.height + "px";
    overlay.style.top = mainBCR.top + "px";
    overlay.style.left = mainBCR.left + "px";
}
overlay.addEventListener("resize", configureScreenInteractionsMazeOverlay);
var isMoving = false;
var lastTouchX, lastTouchY;
window.touchNavAssistTimeout = null;
["mousedown", "touchstart"].forEach(evt => overlay.addEventListener(evt, (e) => {
    isMoving = true
    lastTouchX = e.touches ? e.touches[0].clientX : undefined;
    lastTouchY = e.touches ? e.touches[0].clientY : undefined;
    clearTimeout(window.touchNavAssistTimeout)
    window.touchNavAssistTimeout = setTimeout(navAssistInit, 500)
}));
["mouseup", "touchend"].forEach(evt => addEventListener(evt, () => {
    isMoving = false
    clearTimeout(window.touchNavAssistTimeout)
    navAssistStop()
}));

overlay.addEventListener("mousedown", () => overlay.style.cursor = "grabbing");
addEventListener("mouseup", () => overlay.style.cursor = "grab");

// click and drag to scroll
var recentlyClicked = false;
var recentlyClickedTimeout;
function resetRecentlyClickedTimeout(t=1000) {
    clearTimeout(recentlyClickedTimeout);
    recentlyClickedTimeout = setTimeout(() => {
        recentlyClicked = false;
        isMoving = false
    }, t);
}
overlay.addEventListener("click", (e) => {
    recentlyClicked = true;
    resetRecentlyClickedTimeout();
})

overlay.addEventListener("mousemove", (e) => {
    if (recentlyClicked && isMoving) {
        const main = document.getElementById("main");
        main.scrollBy(-e.movementX, -e.movementY);
    }
    resetRecentlyClickedTimeout(100);
})
overlay.addEventListener("touchmove", (e) => {
    if (e.touches.length != 1) return;
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
window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    focusElem(player.currentElem)
});

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
overlay.addEventListener("mousemove", (e) => {
    if (!recentlyClicked && isMoving) {
        moveHandler(e.movementX, e.movementY);
    }
})
overlay.addEventListener("touchmove", (e) => {
    if (e.touches.length != 1) return;
    if (!recentlyClicked && isMoving) {
        moveHandler(e.touches[0].clientX - lastTouchX, e.touches[0].clientY - lastTouchY);
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
})

// Pinch to zoom
const zoomThrottleTime = 100;
const lastZoomTime = Date.now();
var lastPinchDistance = 0;
overlay.addEventListener("touchmove", (e) => {
    if (Date.now() - lastZoomTime < zoomThrottleTime) return;
    if (e.touches.length == 2) {
        const newPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (newPinchDistance > lastPinchDistance) {
            zoomIn();
        }
        else if (newPinchDistance < lastPinchDistance) {
            zoomOut();
        }
        lastPinchDistance = newPinchDistance;
        lastZoomTime = Date.now();
    }
})
