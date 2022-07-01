// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg83NLIF7wYNp12dmrYbWpSAs0M_n2S0c",
  authDomain: "onmenu-3884a.firebaseapp.com",
  projectId: "onmenu-3884a",
  storageBucket: "onmenu-3884a.appspot.com",
  messagingSenderId: "584783307968",
  appId: "1:584783307968:web:0c6532a2fc3aae76bf7925",
  measurementId: "G-J76QZEMQEY"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const analytics = getAnalytics(app)