import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvmrpBQmuUWoRsBKpyrmgJRtPZ90ahA0U",
    authDomain: "a-maze-jothinkumar.firebaseapp.com",
    databaseURL: "https://a-maze-jothinkumar-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "a-maze-jothinkumar",
    storageBucket: "a-maze-jothinkumar.appspot.com",
    messagingSenderId: "222156193241",
    appId: "1:222156193241:web:2e719f96af967accd32dc8",
    measurementId: "G-SZ4H3YMY40"
}
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
function sendEvent(eventName, eventParams) {
    logEvent(analytics, eventName, eventParams);
}

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LeeV18qAAAAAL3DIGMSsdmlpC14BHv1tOEY2LQ8'),
    isTokenAutoRefreshEnabled: true
});

const auth = getAuth();
const provider = new GoogleAuthProvider();
auth.onAuthStateChanged((user) => {
    window.user = user;
    if (user) {
        window.dispatchEvent(new Event('login'));
    }
    else {
        window.dispatchEvent(new Event('logout'));
    }
})
window.login = () => {
    if (auth.currentUser) {
        return
    }
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            window.user = result.user;
            window.dispatchEvent(new Event('login'));
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
}
window.logout = () => {
    auth.signOut().then(() => {
        console.log('Logged out');
        window.user = null;
        window.dispatchEvent(new Event('logout'));
    }).catch((error) => {
        console.error(error);
    });
}
window.getUserDetails = () => {
    return {
        name: window.user.displayName,
        email: window.user.email,
        photo: window.user.photoURL,
        uid: window.user.uid,
        lastLogin: window.user.metadata.lastSignInTime,
        creationTime: window.user.metadata.creationTime
    };
}