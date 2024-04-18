function focusElem(elem) {
    const main = document.getElementById("main");
    setTimeout(() => {
        elem.scrollIntoView({block: "center", inline: "center"});
    }, 200)
    const locater = document.getElementById("locate-animation")
    setTimeout(() => {
        const elemRect = elem.getBoundingClientRect();
        locater.style.top = `${(elemRect.top + elemRect.bottom - 200 - main.scrollTop + elemRect.height)/2}px`;
        locater.style.left = `${(elemRect.left + elemRect.right - 200 - main.scrollLeft + elemRect.width)/2}px`;
        locater.classList.add("locate-animation");
    }, 1000)
}
function focusStart() {
    focusElem(window.mp.start.elem);
}
