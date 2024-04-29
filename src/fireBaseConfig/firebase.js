// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXrpZ2-4ELCcroMkvr5bns1yak2bVVqQI",
  authDomain: "calidadinacap-cb101.firebaseapp.com",
  projectId: "calidadinacap-cb101",
  storageBucket: "calidadinacap-cb101.appspot.com",
  messagingSenderId: "366062973229",
  appId: "1:366062973229:web:e54309df4f514a42d563a4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);