// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCan-gCoI3aCSbXlF4OkwxMWkHAPO0po6w",
  authDomain: "gest-par-zedic.firebaseapp.com",
  databaseURL: "https://gest-par-zedic-default-rtdb.firebaseio.com",
  projectId: "gest-par-zedic",
  storageBucket: "gest-par-zedic.firebasestorage.app",
  messagingSenderId: "288874801574",
  appId: "1:288874801574:web:a90619722433d3cb858767",
  measurementId: "G-08H12S1NR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage }; 