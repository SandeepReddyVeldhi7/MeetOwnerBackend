import User from "../models/User.js";
import generateToken from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

//  Login or Auto-Register
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log("req.body:::login ", req.body);
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  let user = await User.findOne({ email });

  if (!user) {
    // Auto-register new user
    user = await User.create({ email, password });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);
  res.status(200).json({ token, user });
};

// Register manually (separate)
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log("req.body:::", req.body);
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ email, password });
  const token = generateToken(user._id);
  res.status(201).json({ token, user });
};

// Forgot Password — Send OTP
export const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  // console.log("req.body111", req.body);
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  user.otp = { code: otp, expiresAt };
  await user.save();

  await sendOTPEmail(email, otp); // Simulated

  res.status(200).json({ message: "OTP sent to email" });
};

//  Verify OTP + Reset Password
export const verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    !user.otp ||
    user.otp.code !== otp ||
    user.otp.expiresAt < new Date()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.otp = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};
