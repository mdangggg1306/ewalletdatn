// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import userRoute from "./routes/users.js";
// import authRoute from "./routes/auth.js";
// import serviceRoute from "./routes/services.js";
// import transactionRoute from "./routes/transactions.js";
// import balanceRoute from "./routes/balance.js";
// import bodyParser from "body-parser";
// import vnpayRoute from "./routes/vnpay.js";
// import historyRoute from "./routes/userhistories.js";

// //config
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// //conect db
// const PORT = process.env.PORT || 3002;
// let db;
// export const connectDb = async () => {
//   const firebaseConfig = {
//     apiKey: "AIzaSyC5NnnKNXtgWqhUYTpe6j7o0lCfwBp4HQg",
//     authDomain: "cdtt-1ba2a.firebaseapp.com",
//     databaseURL:
//       "https://cdtt-1ba2a-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "cdtt-1ba2a",
//     storageBucket: "cdtt-1ba2a.appspot.com",
//     messagingSenderId: "625667945221",
//     appId: "1:625667945221:web:3e16e12bb7e1691489fd6c",
//   };

//   const fs = initializeApp(firebaseConfig);
//   db = getFirestore(fs);
//   app.listen(PORT, () => console.log(`server port: ${PORT}`));
// };
// connectDb();

// export const getDb = () => {
//   return db;
// };

// //route
// app.use("/users", userRoute);
// app.use("/auth", authRoute);
// app.use("/services", serviceRoute);
// app.use("/transactions", transactionRoute);
// app.use("/balance", balanceRoute);
// app.use("/vnpay", vnpayRoute);
// app.use("/history", historyRoute);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import serviceRoute from "./routes/services.js";
import transactionRoute from "./routes/transactions.js";
import balanceRoute from "./routes/balance.js";
import bodyParser from "body-parser";
import vnpayRoute from "./routes/vnpay.js";
import historyRoute from "./routes/userhistories.js";
import { createServer } from "http";
import { setupWebSocket } from "./websocket.js";
//config
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const server = createServer(app);
const wss = setupWebSocket(server);

//conect db
const PORT = process.env.PORT || 3002;
let db;
export const connectDb = async () => {
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

  const fs = initializeApp(firebaseConfig);
  db = getFirestore(fs);
  server.listen(PORT, () => console.log(`server port: ${PORT}`));
};
connectDb();

export const getDb = () => {
  return db;
};

//route
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/services", serviceRoute);
app.use("/transactions", transactionRoute);
app.use("/balance", balanceRoute);
app.use("/vnpay", vnpayRoute);
app.use("/history", historyRoute);
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com"
  );
  next();
});
