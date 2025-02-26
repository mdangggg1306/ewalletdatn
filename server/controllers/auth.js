import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { getDb } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

// LOGIN
export const login = async (req, res) => {
  try {
    const usersCollection = collection(getDb(), "Users");
    const q = query(usersCollection, where("userId", "==", req.body.userId));
    const userDetails = await getDocs(q);

    if (userDetails.empty) {
      // Không tìm thấy người dùng có username cụ thể
      return res.status(404).json({ status: "failed", msg: "User not found" });
    }

    const userDocRef = doc(usersCollection, userDetails.docs[0].id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    userData.objectId = userDoc.id;

    if (userData.role == "admin")
      return res.status(403).json({ msg: "Access denied" });

    const isMatch = await bcrypt.compare(req.body.password, userData.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: userData.objectId, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete userData.password;

    return res.status(200).json({ userData, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const usersCollection = collection(getDb(), "Users");
    const q = query(usersCollection, where("userId", "==", req.body.userId));
    const userDetails = await getDocs(q);

    if (userDetails.empty) {
      // Không tìm thấy người dùng có username cụ thể
      return res.status(404).json({ msg: "User not found" });
    }

    const userDocRef = doc(usersCollection, userDetails.docs[0].id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    userData.objectId = userDoc.id;

    if (userData.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const isMatch = await bcrypt.compare(req.body.password, userData.password);
    if (!isMatch) return res.status(402).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: userData.objectId, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete userData.password;

    res.status(200).json({ token, userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email); // Log email nhận được

    const usersCollection = collection(getDb(), "Users");
    const q = query(usersCollection, where("email", "==", email));
    const userDetails = await getDocs(q);

    console.log("Query executed, userDetails:", userDetails); // Log kết quả truy vấn

    if (userDetails.empty) {
      console.log("User not found"); // Log khi không tìm thấy người dùng
      return res.status(404).json({ msg: "User not found" });
    }

    const verificationCode = crypto.randomBytes(3).toString("hex");
    console.log("Generated verification code:", verificationCode); // Log mã xác nhận

    const userDocRef = doc(usersCollection, userDetails.docs[0].id);
    await updateDoc(userDocRef, { verificationCode });
    console.log("Updated user document with verification code"); // Log khi cập nhật tài liệu người dùng

    // Cấu hình và gửi email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dangdz1362003@gmail.com",
        pass: "13062003",
      },
    });

    const mailOptions = {
      from: "dangdz1362003@gmail.com",
      to: email,
      subject: "Mã xác nhận đặt lại mật khẩu",
      text: `Mã xác nhận của bạn là: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification code sent to email"); // Log khi gửi mã xác nhận thành công

    res.status(200).json({ msg: "Verification code sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error); // Log lỗi chi tiết
    res.status(500).json({ error: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    const usersCollection = collection(getDb(), "Users");
    const q = query(usersCollection, where("email", "==", email));
    const userDetails = await getDocs(q);
    console.log(userDetails);

    if (userDetails.empty) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userDocRef = doc(usersCollection, userDetails.docs[0].id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    if (userData.verificationCode !== verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateDoc(userDocRef, {
      password: hashedPassword,
      verificationCode: null,
    });

    res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
