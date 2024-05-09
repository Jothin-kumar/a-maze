function pickRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class PathInvalidError extends Error {
    constructor(msg) {
        super(msg);
    }
}
class DotAlreadyInUseError extends Error {
    constructor(msg) {
        super(msg);
    }
}

function elemsColliding(elem1, elem2, pad=0) {
    const bc1 = elem1.getBoundingClientRect();
    const bc2 = elem2.getBoundingClientRect();
    return Math.abs(bc1.right - bc2.right + bc1.left - bc2.left) < bc1.width + bc2.width + pad && Math.abs(bc1.top - bc2.top + bc1.bottom - bc2.bottom) < bc1.height + bc2.height + pad;
}
function f() {
    console.log(elemsColliding(document.getElementById("onscreen-nav"), document.getElementById("main"), 15));
}