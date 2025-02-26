// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOjPb7Ijm5QaEP9PYGI2-M7AWxziSBdf0",
  authDomain: "datn-vdt.firebaseapp.com",
  databaseURL:
    "https://datn-vdt-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datn-vdt",
  storageBucket: "datn-vdt.appspot.com",
  messagingSenderId: "281202261255",
  appId: "1:281202261255:web:caff91830852d09fa899a2",
  measurementId: "G-9Z4M6WMX5Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
