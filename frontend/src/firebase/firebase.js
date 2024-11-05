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
  apiKey: "firebase-api-key",
  authDomain: "ecommerce-ce8d5.firebaseapp.com",
  projectId: "ecommerce-ce8d5",
  storageBucket: "ecommerce-ce8d5.firebasestorage.app",
  messagingSenderId: "279778934253",
  appId: "1:279778934253:web:a25c7d8bd78e00510dfbe4",
  measurementId: "G-QW0WB51W9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export {app, auth, db};