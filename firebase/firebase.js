import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDzDlihYK8JKr9NcaJBaF0xEsgW0sEg1JA",
    authDomain: "project-task-3f04a.firebaseapp.com",
    projectId: "project-task-3f04a",
    storageBucket: "project-task-3f04a.appspot.com",
    messagingSenderId: "1063986307783",
    appId: "1:1063986307783:web:3f794512b41621800a54e2",
    measurementId: "G-PY9N2RNCZH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
