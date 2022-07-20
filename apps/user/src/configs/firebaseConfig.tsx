// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyD3dFIjMMATB7oC5i-cQjBE00AaPKuR684",

  authDomain: "on-menu-phase-2.firebaseapp.com",

  projectId: "on-menu-phase-2",

  storageBucket: "on-menu-phase-2.appspot.com",

  messagingSenderId: "909731102506",

  appId: "1:909731102506:web:9c1d8cfeed23674590a853",

  measurementId: "G-7HC7ZGFTM6"

};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const analytics = getAnalytics(app)