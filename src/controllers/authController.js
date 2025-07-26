
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import { sendOTPEmail } from '../utils/sendEmail.js';





export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  let user = await User.findOne({ email });

  if (!user) {
    // First-time user: create and auto-login
    user = await User.create({ email, password });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.status(200).json({ token, user });
};

export const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = { code: otp, expiresAt };
  await user.save();

  await sendOTPEmail(email, otp);
  res.status(200).json({ message: 'OTP sent to email' });
};

export const verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.password = newPassword;
  user.otp = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};
