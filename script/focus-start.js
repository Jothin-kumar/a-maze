// On portrait screens, autoscroll to extreme right if start isn't visible

function elemInViewPort(elem) {
    const rect = elem.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}

function focusStart() {
    const main = document.getElementById("main");
    main.scrollTo(0, 0);
    if (!elemInViewPort(window.mp.start.elem)) {
        main.scrollTo(1000, 0)
    }
}