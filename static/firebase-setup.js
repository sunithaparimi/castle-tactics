import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJh-Jlg4dckTrKaewhpgh6Znq_G9SIp6s",
    authDomain: "code-generator-7cb37.firebaseapp.com",
    projectId: "code-generator-7cb37",
    storageBucket: "code-generator-7cb37.appspot.com",
    messagingSenderId: "726723343385",
    appId: "1:726723343385:web:3b51ba3d3b2ad934f32688",
    measurementId: "G-SRLSE4F55G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail };