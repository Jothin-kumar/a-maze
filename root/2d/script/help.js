const help = document.getElementById("help-parent")
function showHelp() {
    help.style.display = "block"
}
function hideHelp() {
    help.style.display = "none"
}
window.addEventListener("keydown", (e) => {
    if (["q", "Q"].includes(e.key)) {
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
    if (e.target !== help && !help.contains(e.target) && e.target.id !== "help-btn") {
        hideHelp()
    }
})