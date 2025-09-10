// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWVrgv7maLXPrkrGg_wVFG7PtiEpUREFo",
  authDomain: "habit-quest-studio.firebaseapp.com",
  projectId: "habit-quest-studio",
  storageBucket: "habit-quest-studio.appspot.com",
  messagingSenderId: "1052828751413",
  appId: "1:1052828751413:web:e7c108429fa11543f49c25"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
