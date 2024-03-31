function line(x1, y1, x2, y2, color="rgba(255, 255, 255, .5)") {
    const elem = document.createElementNS("http://www.w3.org/2000/svg", "line");
    elem.setAttribute("x1", x1*10);
    elem.setAttribute("y1", y1*10);
    elem.setAttribute("x2", x2*10);
    elem.setAttribute("y2", y2*10);
    elem.setAttribute("stroke", color);
    window.mg.appendChild(elem);
}

function pathLine(path, color) {
    for (let i = 0; i < path.length-1; i++) {
        line(path[i].x, path[i].y, path[i+1].x, path[i+1].y, color);
    }
}
