// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCTW7FE_Lobjp4XqgBoJSpjw5IORqZ-vA",
    authDomain: "internstar-73b54.firebaseapp.com",
    projectId: "internstar-73b54",
    storageBucket: "internstar-73b54.firebasestorage.app",
    messagingSenderId: "659954885455",
    appId: "1:659954885455:web:d88c87e27b5de769fa5b3a",
    measurementId: "G-3SG12XVX9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };