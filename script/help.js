const help = document.getElementById("help-parent")
function showHelp() {
    help.style.display = "block"
}
function hideHelp() {
    help.style.display = "none"
}
help.addEventListener("click", hideHelp)