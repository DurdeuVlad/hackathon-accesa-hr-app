// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDeidkX4J2v1tNOOVqpYaOUeYtnJifqiV8",
    authDomain: "cvparser-e21c9.firebaseapp.com",
    projectId: "cvparser-e21c9",
    storageBucket: "cvparser-e21c9.firebasestorage.app",
    messagingSenderId: "999099055222",
    appId: "1:999099055222:web:9cea6adde05078cbfb3357",
    measurementId: "G-55ZNHZZB52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);