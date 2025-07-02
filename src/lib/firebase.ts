
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For production, it's recommended to use environment variables to store these keys.
const firebaseConfig = {
  apiKey: "AIzaSyBddsOntca8nX4lyPssDT1Nbp42BTkP8bc",
  authDomain: "scolagest.firebaseapp.com",
  projectId: "scolagest",
  storageBucket: "scolagest.firebasestorage.app",
  messagingSenderId: "972045365853",
  appId: "1:972045365853:web:2a1e1942920b1adf3853b4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
