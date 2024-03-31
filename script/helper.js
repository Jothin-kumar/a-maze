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