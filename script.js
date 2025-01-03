

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDoVM1ty4s3h70LYqCWTk17JomfJ3coP98",
    authDomain: "cyberlabs-project.firebaseapp.com",
    projectId: "cyberlabs-project",
    storageBucket: "cyberlabs-project.firebasestorage.app",
    messagingSenderId: "338339328119",
    appId: "1:338339328119:web:b5add230fde2526158d672"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const submit = document.getElementById('submit');
submit.addEventListener("click", function(event){
    event.preventDefault();
    alert("5");
})