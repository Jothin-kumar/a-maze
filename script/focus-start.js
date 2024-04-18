function focusStart() {
    const main = document.getElementById("main");
    main.scrollTo(0, 0)
    const start = window.mp.start.elem
    setTimeout(() => {
        start.scrollIntoView({block: "center", inline: "center"});
    }, 200)
    const locater = document.getElementById("locate-animation")
    setTimeout(() => {
        const startRect = start.getBoundingClientRect();
        locater.style.top = `${(startRect.top + startRect.bottom - 200 - main.scrollTop + startRect.height)/2}px`;
        locater.style.left = `${(startRect.left + startRect.right - 200 - main.scrollLeft + startRect.width)/2}px`;
        locater.classList.add("locate-animation");
    }, 1000)
}

window.addEventListener("resize", focusStart)