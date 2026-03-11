import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB-URByQJZkJ0pMNJK0qTSzBsVJuy4FNk0",
    authDomain: "anti-planer.firebaseapp.com",
    projectId: "anti-planer",
    storageBucket: "anti-planer.firebasestorage.app",
    messagingSenderId: "235332843252",
    appId: "1:235332843252:web:8e95f47f1736017fcc50a1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
