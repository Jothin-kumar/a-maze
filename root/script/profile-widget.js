/* Mandatory to import connect.js before this */

const pfp = document.createElement('img');
pfp.id = 'pfp';
const style = document.createElement('style');
style.innerHTML = `
#pfp {
    border: 2px solid rgb(67, 35, 41);
    border-radius: 5px;
    position: fixed;
    top: 5px;
    right: 5px;
    cursor: pointer;
    z-index: 1000;
    opacity: 0.69;
    scale: 0.5;
    transition: 0.5s;
}
#pfp:hover {
    transform: rotate(5deg);
    scale: 0.6;
}
#profile-card {
    position: fixed;
    top: 80px;
    right: 5px;
    z-index: 1000;
    display: none;
    text-align: right;
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    background-color: black;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(200, 200, 200, 0.5);
}
#user-name {
    font-size: 1.5em;
    font-weight: bold;
}
#user-id {
    font-size: .8em;
    color: #888f;
}
#user-reg-since {
    font-size: .8em;
    color: #8888;
}
.pfp-button {
    padding: 10px;
    margin: 5px auto;
    font-size: 1rem;
    background-color: black;
    color: white;
    border: 1px solid rgb(63, 67, 35);
    border-radius: 5px;
    cursor: pointer;
    transition: 1s;
    opacity: .8;
}
.pfp-button:hover {
    border: 2px solid olive;
    opacity: 1;
}
.pfp-button.login:hover {
    border: 2px solid green;
    background-color: green;
    opacity: 1;
}
.pfp-button.logout:hover {
    border: 2px solid red;
    background-color: red;
    opacity: 1;
}
`;
const profileCard = document.createElement('div');
profileCard.id = 'profile-card';
profileCard.innerHTML = `
<p id="user-name"></p>
<p id="user-id"></p>
<p id="user-reg-since"></p>
<button class="pfp-button login" onclick="login()" id="login-btn">Sign Up / Log In</button>
<button class="pfp-button logout" onclick="logout()" id="logout-btn" style="display: none;">Logout</button>
`;
document.body.appendChild(pfp);
document.body.appendChild(profileCard);
document.head.appendChild(style);
pfp.onclick = function() {
    document.getElementById('profile-card').style.display = 'block';
}
document.body.onclick = function(event) {
    if (event.target !== pfp && event.target !== profileCard && event.target.parentNode !== profileCard) {
        document.getElementById('profile-card').style.display = 'none';
    }
}

window.addEventListener('login', function(e) {
    const details = getUserDetails()
    pfp.src = details.photo;
    document.getElementById('user-name').innerText = details.name;
    document.getElementById('user-id').innerText = details.uid;
    document.getElementById('user-reg-since').innerText = `Registered A-Maze player since ${details.creationTime}`;
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'block';
});
window.addEventListener('logout', function(e) {
    pfp.src = '/assets/img/unknown.png';
    document.getElementById('user-name').innerText = 'Anonymous Player';
    document.getElementById('user-id').innerText = '00000000000000000000000';
    document.getElementById('user-reg-since').innerText = 'Registered A-Maze player since... Now?';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none';
});