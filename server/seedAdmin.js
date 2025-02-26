import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Firebase configuration
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
const db = getFirestore(app);

// Password to be hashed
const saltRounds = 10;
const plainPassword = "123456";

bcrypt.hash(plainPassword, saltRounds, async function (err, hash) {
  if (err) {
    console.error(err);
  } else {
    try {
      const userDocRef = doc(collection(db, "Users"), "2b1N6RMPmRiNMkMRtGwm"); // Thay thế bằng ID của bạn
      await setDoc(userDocRef, {
        userId: "admin",
        password: hash,
        role: "admin",
      });
      console.log("Password updated successfully");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
});
