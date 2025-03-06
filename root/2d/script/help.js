const help = document.getElementById("help-parent")
function showHelp() {
    help.style.display = "block"
    window.navNotAllowed = true
    main.style.opacity = "0.2"
    if (!isNavAssistHidden()) hideNavAssist("help")
}
function hideHelp() {
    help.style.display = "none"
    window.navNotAllowed = false
    main.style.opacity = "1"
    if (window.navAssistHiddenBy === "help") displayNavAssist()
}
const isHelpOpen = () => help.style.display === "block"
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isHelpOpen()) {
        hideHelp()
    }
})

function helpBtn() {
    if (help.style.display === "block") {
        hideHelp()
    } else {
        showHelp()
    }
}
document.addEventListener("click", (e) => {
    if (isHelpOpen() && ["maze-grid", "main-and-controls-parent"].includes(e.target.id)) {
        hideHelp()
    }
})