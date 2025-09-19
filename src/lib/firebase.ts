
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length) {
    app = getApp();
} else {
    try {
        if (firebaseConfig.apiKey) {
            app = initializeApp(firebaseConfig);
        } else {
            console.error("Firebase config is missing. Make sure to set up your .env file.");
        }
    } catch (error) {
        console.error("Firebase initialization error:", error);
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
