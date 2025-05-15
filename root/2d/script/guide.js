async function showGuideTooltip(elem, text, callback=() => {}) {
    const tooltip = document.createElement("p");
    tooltip.classList.add("guide-tooltip");
    document.body.appendChild(tooltip);
    tooltip.innerHTML = text;
    tooltip.removed = false;
    function removeTooltip() {
        try {
            document.body.removeChild(tooltip);
            callback();
        }
        catch (e) {
            if (e instanceof DOMException) {
                // Ignore the error
            } else {
                throw e;
            }
        }
        tooltip.removed = true;
    }
    addEventListener("click", removeTooltip);
    addEventListener("keydown", removeTooltip);
    while (!tooltip.removed) {
        const rect = elem.getBoundingClientRect();
        cx = window.innerWidth / 2;
        cy = window.innerHeight / 2;
        ex = rect.left + rect.width / 2;
        ey = rect.top + rect.height / 2;        
        
        if (ex > cx) {
            if (ex + tooltip.getBoundingClientRect().width > window.innerWidth) {
                tooltip.style.right = "0px"
                tooltip.style.left = "auto";
            }
            else {
                tooltip.style.right = `${window.innerWidth - ex}px`;
                tooltip.style.left = "auto";
            }
        }
        else {
            if (ex - tooltip.getBoundingClientRect().width < 0) {
                tooltip.style.left = "0px"
                tooltip.style.right = "auto";
            }
            else {
                tooltip.style.left = `${ex}px`;
                tooltip.style.right = "auto";
            }
        }
        if (ey > cy) {
            if (ey + tooltip.getBoundingClientRect().height > window.innerHeight) {
                tooltip.style.bottom = "0px"
                tooltip.style.top = "auto";
            }
            else {
                tooltip.style.bottom = `${window.innerHeight - ey}px`;
                tooltip.style.top = "auto";
            }
        }
        else {
            if (ey - tooltip.getBoundingClientRect().height < 0) {
                tooltip.style.top = "0px"
                tooltip.style.bottom = "auto";
            }
            else {
                tooltip.style.top = `${ey}px`;
                tooltip.style.bottom = "auto";
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

window.guideShowing = false;
function showGuide() {
    if (window.guideShowing) return;
    window.guideShowing = true;
    window.navNotAllowed = true;
    document.getElementById("guide-btn").style.opacity = 0;
    setTimeout(() => {
        setZoom(window.zoom*2);
        window.mp.end.elem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        showGuideTooltip(window.mp.end.elem, "This is your goal. Click for next", () => {
            window.player.currentElem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            showGuideTooltip(window.player.currentElem, "You're here.", async () => {
                showGuideTooltip(document.getElementById("nav-assist-btn"),
                    isTouchDevice ? "Click above, below, left or right to move." : "Use arrow keys or WASD to move.",
                    async () => {
                        targetZoom = window.zoom/2;
                        while (targetZoom < window.zoom) {
                            setZoom(window.zoom - .1);
                            if (window.zoom - targetZoom < .1) {
                                setZoom(targetZoom);
                                break;
                            }
                            await new Promise(r => setTimeout(r, 1));
                        }
                        window.player.currentElem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                        showGuideTooltip(window.player.currentElem, "You're all set!")
                        window.navNotAllowed = false
                        window.guideShowing = false;
                        document.getElementById("guide-btn").style.opacity = 1;
                    }
                )
            })
        });
    }, 100)
}