import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "../index.js";
import * as firebase from "firebase/app";
import { getWss } from "../websocket.js";
import WebSocket from "ws";

export const thanhtoan = async (req, res) => {
  try {
    // Lấy user với userId = cardID
    const usersCollection = collection(getDb(), "Users");
    const q = query(usersCollection, where("cardID", "==", req.body.cardID));
    const userDetails = await getDocs(q);
    if (userDetails.empty) {
      // Không tìm thấy người dùng có cardID cụ thể
      return res.status(404).json({
        type: "paymentResult",
        success: false,
        message: "User not found",
      });
    }

    const userDocRef = doc(usersCollection, userDetails.docs[0].id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    // Lấy amount với serviceName = serviceName
    const servicesCollection = collection(getDb(), "services");
    const q2 = query(
      servicesCollection,
      where("serviceName", "==", req.body.serviceName)
    );
    const svDetails = await getDocs(q2);
    if (svDetails.empty) {
      // Không tìm thấy dịch vụ có serviceName cụ thể
      return res.status(405).json({
        type: "paymentResult",
        success: false,
        message: "Service not found",
      });
    }

    const svDocRef = doc(servicesCollection, svDetails.docs[0].id);
    const svDoc = await getDoc(svDocRef);
    const svData = svDoc.data();

    // Kiểm tra số dư
    if (userData.balance < svData.amount) {
      return res.status(403).json({
        type: "paymentResult",
        success: false,
        message: "Insufficient balance",
      });
    }

    const newbalance = userData.balance - svData.amount;

    // Cập nhật balance
    await setDoc(userDocRef, { balance: newbalance }, { merge: true });

    // Thêm user history
    const message = "Thanh toán " + req.body.serviceName;
    const currentTimestamp = Timestamp.fromDate(new Date());
    const newdata = {
      Timestamp: currentTimestamp,
      type: req.body.serviceName,
      userId: userData.userId,
      amount: parseFloat(svData.amount),
      message: message,
    };
    const historiesCollection = collection(getDb(), "userhistories");
    const history = await addDoc(historiesCollection, newdata);

    // Trả về phản hồi với thông tin dịch vụ và giá
    const response = {
      type: "paymentResult",
      success: true,
      amount: svData.amount,
      message: "Payment successful",
    };

    // Send WebSocket message
    const wss = getWss();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });

    return res.status(200).json(response);
  } catch (error) {
    const response = {
      type: "paymentResult",
      success: false,
      message: error.message,
    };
    const wss = getWss();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });
    return res.status(500).json(response);
  }
};
