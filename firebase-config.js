
// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

apiKey: "AIzaSyBrO5KxeMWGtUSYCATNE6DI0a7V4UJu44U",

authDomain: "copycookdatabase.firebaseapp.com",

projectId: "copycookdatabase",

storageBucket: "copycookdatabase.firebasestorage.app",

messagingSenderId: "798399811699",

appId: "1:798399811699:web:f821d9503369de838cda06",

measurementId: "G-MSMRF8RYKF"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);



const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
 event.preventDefault()
 createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
     // Signed up
     const user = userCredential.user;
     alert("working");
     // ...
   })
   .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
     alert(errorMessage);
     // ..
   });

})