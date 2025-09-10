// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDWVrgv7maLXPrkrGg_wVFG7PtiEpUREFo",
  authDomain: "dev-habit-quest.firebaseapp.com",
  projectId: "habit-quest-148",
  storageBucket: "dev-habit-quest.appspot.com",
  messagingSenderId: "105559642375",
  appId: "1:105559642375:web:8e3d3e6d8c634e72355e2e"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
