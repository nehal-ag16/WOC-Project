// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWDqUXR_t_iGXzD3hNliw8A5QyrZOvqQs",
    authDomain: "woc-project-fb4c1.firebaseapp.com",
    projectId: "woc-project-fb4c1",
    storageBucket: "woc-project-fb4c1.firebasestorage.app",
    messagingSenderId: "684870431165",
    appId: "1:684870431165:web:231109b0786fc12a24a2d4"
};

firebase.initializeApp(firebaseConfig);

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        alert("User successfully logged in!");
        console.log("success");

        // Redirect to game page
        window.location.href = "game.html"; 
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});
