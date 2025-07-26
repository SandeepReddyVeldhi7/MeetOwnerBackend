import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset OTP",
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
};
