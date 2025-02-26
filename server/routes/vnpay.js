import express from "express";
import config from "config";
import querystring from "qs";
import crypto from "crypto";
import moment from "moment";
import { getDb } from "../index.js";
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

const router = express.Router();

router.post("/create_payment_url", function (req, res, next) {
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const tmnCode = config.get("vnp_TmnCode");
  const secretKey = config.get("vnp_HashSecret");
  const vnpUrl = config.get("vnp_Url");
  const returnUrl = config.get("vnp_ReturnUrl");

  const orderId = moment(date).format("DDHHmmss");
  const amount = req.body.amount;
  const bankCode = "";

  const orderInfo = req.body.userId;

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = "250000";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl =
    vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

  res.send(paymentUrl);
});

router.get("/deposit/vnpay_return", async function (req, res, next) {
  let vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const resCode = vnp_Params["vnp_ResponseCode"];
  const userId = vnp_Params["vnp_OrderInfo"];
  const amount = parseFloat(vnp_Params["vnp_Amount"]) / 100; // Chuyển đổi số tiền từ đồng sang đơn vị tiền tệ
  const sendId = vnp_Params["vnp_BankCode"];

  const tmnCode = config.get("vnp_TmnCode");
  const secretKey = config.get("vnp_HashSecret");

  const signData = querystring.stringify(vnp_Params, { encode: false });

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (resCode === "00") {
      try {
        // Lấy thông tin người dùng từ Firestore
        const usersCollection = collection(getDb(), "Users");
        const q = query(usersCollection, where("userId", "==", userId));
        const userDetails = await getDocs(q);
        if (userDetails.empty) {
          return res
            .status(404)
            .json({ status: "failed", msg: "User not found" });
        }

        const userDocRef = doc(usersCollection, userDetails.docs[0].id);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const name = userData.username;
        const newbalance = userData.balance + amount;

        // Cập nhật số dư tài khoản
        await setDoc(userDocRef, { balance: newbalance }, { merge: true });

        // Thêm giao dịch vào Firestore
        const currentTimestamp = Timestamp.fromDate(new Date());
        const newdata = {
          type: "Nạp tiền",
          createID: sendId,
          receiverName: name,
          createTime: currentTimestamp,
          amount: amount,
          method: "VNPAY Payment Gateway",
          receiveID: userId,
        };
        const tranCollection = collection(getDb(), "transactions");
        const newDocRef = await addDoc(tranCollection, newdata);

        // Trả về phản hồi đầy đủ
        // return res.status(200).send({
        //   status: "success",
        //   msg: "Nạp tiền thành công",
        //   doc: newDocRef.id,
        // });
        return res.redirect(
          `http://localhost:3000/deposit/vnpay_return?status=success`
        );
      } catch (error) {
        console.error("Error processing transaction:", error);
        res.redirect(
          `http://localhost:3000/deposit/vnpay_return?status=failed`
        );
      }
    } else {
      console.error("Transaction failed with response code:", resCode);
      res.status(401).send({
        status: "failed",
        msg: "Giao dịch không thành công",
      });
    }
  } else {
    console.error("Invalid signature");
    res.status(400).send({
      status: "failed",
      msg: "Chữ ký không hợp lệ",
    });
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default router;
