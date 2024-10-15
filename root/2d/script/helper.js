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

function stopAllTransition() {
    document.body.classList.add("donotanimate");
}
function resumeAllTransition() {
    document.body.classList.remove("donotanimate");
}

function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}
function getCookie(name) {
    const cookie = document.cookie.split("; ").find(cookie => cookie.startsWith(name));
    if (cookie) {
        return cookie.split("=")[1];
    }
    return null;
}
function deleteCookie(name) {
    setCookie(name, "");
}
class CookieManager {
    constructor() {
        document.cookie.split("; ").forEach(cookie => {
            const [name, value] = cookie.split("=");
        });
    }
    set(name, value) {
        document.cookie = `${name}=${value}; path=/`;
    }
    get(name) {
        const cookie = document.cookie.split("; ").find(cookie => cookie.startsWith(name));
        if (cookie) {
            return cookie.split("=")[1];
        }
        return null;
    }
    has(name) {
        return Boolean(this.get(name));
    }
}
