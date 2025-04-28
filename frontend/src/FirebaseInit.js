// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// If you plan to use Storage or other services, uncomment below:
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeidkX4J2v1tNOOVqpYaOUeYtnJifqiV8",
    authDomain: "cvparser-e21c9.firebaseapp.com",
    projectId: "cvparser-e21c9",
    storageBucket: "cvparser-e21c9.appspot.com",
    messagingSenderId: "999099055222",
    appId: "1:999099055222:web:9cea6adde05078cbfb3357",
    measurementId: "G-55ZNHZZB52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
// const storage = getStorage(app);

export { app, analytics, db, auth /*, storage */ };
