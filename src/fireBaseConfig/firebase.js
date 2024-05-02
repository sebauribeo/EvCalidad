// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration -- Seba
/*const firebaseConfig = {
  apiKey: "AIzaSyAXrpZ2-4ELCcroMkvr5bns1yak2bVVqQI",
  authDomain: "calidadinacap-cb101.firebaseapp.com",
  projectId: "calidadinacap-cb101",
  storageBucket: "calidadinacap-cb101.appspot.com",
  messagingSenderId: "366062973229",
  appId: "1:366062973229:web:e54309df4f514a42d563a4"
};*/
//Credenciales Diego

const firebaseConfig = {
  apiKey: "AIzaSyCjN-i8dJX0I8Tt2ijgAWo6-0zxN-Qg3mo",
  authDomain: "backend-aseguramiento-calidad.firebaseapp.com",
  projectId: "backend-aseguramiento-calidad",
  storageBucket: "backend-aseguramiento-calidad.appspot.com",
  messagingSenderId: "410197611386",
  appId: "1:410197611386:web:0eb4936f3de909ae603cc3"
};
// Initialize Firebase
/*
const firebaseConfig = {
  apiKey: "AIzaSyAqPdogbx1zhn-g1OFPCZZTlsKN0TFV1Ls",
  authDomain: "calidad-f092b.firebaseapp.com",
  projectId: "calidad-f092b",
  storageBucket: "calidad-f092b.appspot.com",
  messagingSenderId: "413049787517",
  appId: "1:413049787517:web:b79cce015d8cad7b718d14"
};*/

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);