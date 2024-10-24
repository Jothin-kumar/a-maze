window.navAssistBtn = document.getElementById('nav-assist-btn');
navAssistBtn.addEventListener('click', function() {
    if (navAssistInUse) {
        navAssistStop()
    }
    else {
        navAssistInit()
    }
});

document.getElementById("maze-grid").addEventListener('click', function(e) {
    const navAssistBCR = navAssistBtn.getBoundingClientRect();  
    const x = e.clientX - ((navAssistBCR.left + navAssistBCR.right)/2);
    const y = e.clientY - ((navAssistBCR.top + navAssistBCR.bottom)/2);
    if (Math.abs(x/y) > 2) {
        if (x > 0) {
            player.moveBy(1, 0)
        }
        else {
            player.moveBy(-1, 0)
        }
    }
    else if (Math.abs(y/x) > 2) {
        if (y > 0) {
            player.moveBy(0, 1)
        }
        else {
            player.moveBy(0, -1)
        }
    }
})