// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3dFIjMMATB7oC5i-cQjBE00AaPKuR684",
    authDomain: "on-menu-phase-2.firebaseapp.com",
    projectId: "on-menu-phase-2",
    storageBucket: "on-menu-phase-2.appspot.com",
    messagingSenderId: "909731102506",
    appId: "1:909731102506:web:9c1d8cfeed23674590a853",
    measurementId: "G-7HC7ZGFTM6"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase)
export const analytics = getAnalytics(firebase);
export const db = getFirestore(firebase)