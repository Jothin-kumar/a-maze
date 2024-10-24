window.navAssistBtn = document.getElementById('nav-assist-btn');
navAssistBtn.addEventListener('click', function() {
    if (navAssistInUse) {
        navAssistStop()
    }
    else {
        navAssistInit()
    }
});