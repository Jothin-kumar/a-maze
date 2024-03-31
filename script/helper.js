function pickRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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