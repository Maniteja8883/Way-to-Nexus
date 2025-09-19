
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCLE-kWEhAvg-Gf-fjVrggeAGt-4HUjMI",
  authDomain: "studio-5097434732-c0fe6.firebaseapp.com",
  projectId: "studio-5097434732-c0fe6",
  storageBucket: "studio-5097434732-c0fe6.appspot.com",
  messagingSenderId: "402506581201",
  appId: "1:402506581201:web:5238415684377624f531f0",
  measurementId: ""
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (getApps().length) {
    app = getApp();
} else {
    try {
        app = initializeApp(firebaseConfig);
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // In a real app, you might want to handle this more gracefully
    }
}

// @ts-ignore
if (app) {
    try {
        auth = getAuth(app);
    } catch (error) {
        console.error("Firebase Auth initialization error:", error);
    }
}

// @ts-ignore
export { app, auth };
