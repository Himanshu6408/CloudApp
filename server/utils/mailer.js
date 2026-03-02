import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Storage App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP for Registration",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      </div>
    `,
  });
};