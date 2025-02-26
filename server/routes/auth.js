import express from "express";
import {
  login,
  loginAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

// LOGIN
router.post("/login/admin", loginAdmin);
router.post("/login", login);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

export default router;
