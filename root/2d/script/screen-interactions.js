window.navAssistBtn = document.getElementById('nav-assist-btn');
navAssistBtn.addEventListener('click', function() {
    if (navAssistInUse) {
        navAssistStop()
    }
    else {
        navAssistInit()
    }
});
// Code for handling navAssist drag is stolen from a file from the past (on-screen-nav.js)
function dragHandler() { // Writing it in a function cuz I'm too lazy to change the variable names...
    // Initialize variables for tracking touch positions
    let initialX = 0;
    let initialY = 0;
    window.currentX = 0;
    window.currentY = 0;

    function toXY(x, y) {
        if (x < 100) {
            x = 100;
        }
        if (y < 100) {
            y = 100;
        }
        if (x > window.innerWidth - navAssistBtn.offsetWidth - 100) {
            x = window.innerWidth - navAssistBtn.offsetWidth - 100;
        }
        if (y > window.innerHeight - navAssistBtn.offsetHeight - 100) {
            y = window.innerHeight - navAssistBtn.offsetHeight - 100;
        }
        navAssistBtn.style.transform = `translate(${x}px, ${y}px)`;
        window.currentX = x;
        window.currentY = y;
    }

    // Function to handle touch start event
    function handleTouchStart(event) {
        initialX = event.touches[0].clientX - currentX;
        initialY = event.touches[0].clientY - currentY;
    }

    // Function to handle touch move event
    function handleTouchMove(event) {
        event.preventDefault();
        toXY(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY);
    }

    // Add event listeners for touch events
    navAssistBtn.addEventListener('touchstart', handleTouchStart, false);
    navAssistBtn.addEventListener('touchmove', handleTouchMove, false);

    // Add event listeners for mouse events
    navAssistBtn.addEventListener('mousedown', (e) => {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handleMouseMove);
        });
        window.addEventListener('blur', () => {
            window.removeEventListener('mousemove', handleMouseMove);
        });
        window.addEventListener('click', () => {
            window.removeEventListener('mousemove', handleMouseMove);
        });
    });
    function handleMouseMove(e) {
        toXY(e.clientX - initialX, e.clientY - initialY);
        unfocusControls()
    }
    window.adjustNavAssistPosition = () => {
        const mainBC = main.getBoundingClientRect();
        toXY(mainBC.width/2 - navAssistBtn.offsetWidth/2, mainBC.height/2 - navAssistBtn.offsetHeight/2);
    }
    window.addEventListener('resize', adjustNavAssistPosition);
}
dragHandler();

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