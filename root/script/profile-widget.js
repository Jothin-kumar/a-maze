/* Mandatory to import connect.js before this */

const pfp = document.createElement('img');
pfp.id = 'profile-widget';
const style = document.createElement('style');
style.innerHTML = `
#profile-widget {
    border: 2px solid rgb(67, 35, 41);
    border-radius: 5px;
    position: fixed;
    top: calc(5px + 100dvh - 100dvh);
    right: calc(5px + 100dvw - 100dvw);
    cursor: pointer;
    z-index: 1000;
    opacity: 0.69;
    scale: 0.5;
    transition: 0.5s;
}
#profile-widget:hover {
    transform: rotate(5deg);
    scale: 0.6;
}
`;
document.body.appendChild(pfp);
document.head.appendChild(style);
pfp.onclick = function() {
    window.open('/me', '_blank');
}

window.addEventListener('login', function(e) {
    const details = getUserDetails()
    pfp.src = details.photo;
});
window.addEventListener('logout', function(e) {
    pfp.src = '/assets/img/unknown.png';
});