async function showGuideTooltip(elem, text, callback=() => {}) {
    const tooltip = document.createElement("p");
    tooltip.classList.add("guide-tooltip");
    document.body.appendChild(tooltip);
    tooltip.innerHTML = text;
    tooltip.removed = false;
    function removeTooltip() {
        document.body.removeChild(tooltip);
        tooltip.removed = true;
        callback();
    }
    addEventListener("click", removeTooltip);
    addEventListener("keypress", removeTooltip);
    while (!tooltip.removed) {
        const rect = elem.getBoundingClientRect();
        cx = window.innerWidth / 2;
        cy = window.innerHeight / 2;
        ex = rect.left + rect.width / 2;
        ey = rect.top + rect.height / 2;
        console.log(`cx: ${cx}, cy: ${cy}, tx: ${ex}, ty: ${ey}`);
        
        if (ex > cx) {
            tooltip.style.right = `${window.innerWidth - ex}px`;
            tooltip.style.left = "auto";
        }
        else {
            tooltip.style.left = `${ex}px`;
            tooltip.style.right = "auto";
        }
        if (ey > cy) {
            tooltip.style.bottom = `${window.innerHeight - ey}px`;
            tooltip.style.top = "auto";
        }
        else {
            tooltip.style.top = `${ey}px`;
            tooltip.style.bottom = "auto";
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}