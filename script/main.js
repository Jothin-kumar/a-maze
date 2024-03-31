function revealAnswer() {
    mp.path.forEach((dot) => {
        dot.setColor("rgba(0, 0, 255, .25)");
     });
}
setTimeout(construct, 100)
window.addEventListener("touchstart", () => {
    document.body.requestFullscreen();
})
window.addEventListener("click", () => {
    document.body.requestFullscreen();
})