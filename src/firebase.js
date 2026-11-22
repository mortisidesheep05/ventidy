import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAz5HnFBahkI8ASwDBY4NnIXs27rSN11hQ",
    authDomain: "ventidy-d3872.firebaseapp.com",
    projectId: "ventidy-d3872",
    storageBucket: "ventidy-d3872.firebasestorage.app",
    messagingSenderId: "888321261023",
    appId: "1:888321261023:web:a4e93047e18618cf9dd86a",
    measurementId: "G-QS2FLW5LSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics can throw in unsupported/blocked environments; never let it break the app
export let analytics = null;
isSupported()
    .then((ok) => {
        if (ok) analytics = getAnalytics(app);
    })
    .catch(() => {});