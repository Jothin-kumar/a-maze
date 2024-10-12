/* Mandatory to import connect.js before this */

const pfp = document.createElement('img');
pfp.style.border = '2px solid rgb(67, 35, 41)';
pfp.style.borderRadius = '5px';
pfp.style.position = 'fixed';
pfp.style.top = '10px';
pfp.style.right = '10px';
pfp.style.scale = '0.5';
pfp.style.cursor = "pointer";
pfp.style.zIndex = '1000';
document.body.appendChild(pfp);
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