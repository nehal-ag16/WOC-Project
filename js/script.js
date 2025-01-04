
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoVM1ty4s3h70LYqCWTk17JomfJ3coP98",
    authDomain: "cyberlabs-project.firebaseapp.com",
    projectId: "cyberlabs-project",
    storageBucket: "cyberlabs-project.appspot.com",
    messagingSenderId: "338339328119",
    appId: "1:338339328119:web:b5add230fde2526158d672"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupForm = document.getElementById('signupForm');

signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            alert("Sign-up successful! Welcome, " + user.email);
            // Redirect or perform other actions here
            window.location.href = "game.html"; // Change this to your desired page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
        });
});
