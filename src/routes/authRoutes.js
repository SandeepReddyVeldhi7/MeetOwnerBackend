import express from "express";
import {
  loginUser,
  registerUser,
  sendForgotPasswordOTP,
  verifyOTPAndResetPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/forgot-password", sendForgotPasswordOTP);
router.post("/reset-password", verifyOTPAndResetPassword);
router.post("/register", registerUser);
export default router;
