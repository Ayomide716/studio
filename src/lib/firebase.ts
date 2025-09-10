// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY9QLvB-9fg3Bi1LK3cj-8oEkiXo3WdkI",
  authDomain: "sample-firebase-ai-34d85.firebaseapp.com",
  projectId: "sample-firebase-ai-34d85",
  storageBucket: "sample-firebase-ai-34d85.appspot.com",
  messagingSenderId: "538382735670",
  appId: "1:538382735670:web:7a278d2a6149d03f01bb97"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
