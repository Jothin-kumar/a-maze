function elemInViewport(elem, sm) {
    const rect = elem.getBoundingClientRect();
    const main = document.getElementById("main");
    const mainRect = main.getBoundingClientRect();
    return (
        rect.top >= mainRect.top + sm &&
        rect.left >= mainRect.left + sm &&
        rect.bottom <= mainRect.bottom + sm &&
        rect.right <= mainRect.right + sm
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
    const locater = document.getElementById("locate-animation")
    setTimeout(() => {
        const elemRect = elem.getBoundingClientRect();
        locater.style.top = `${(elemRect.top + elemRect.bottom - 200 - main.scrollTop + elemRect.height)/2}px`;
        locater.style.left = `${(elemRect.left + elemRect.right - 200 - main.scrollLeft + elemRect.width)/2}px`;
        locater.classList.add("locate-animation");
    }, 1000)
}
