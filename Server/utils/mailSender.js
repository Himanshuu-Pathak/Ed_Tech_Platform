const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // ✅ Create transporter with Gmail SMTP settings
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com", // fallback to Gmail if not set
      port: 465, // ✅ Use secure port for Gmail
      secure: true, // ✅ true for port 465
      auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_PASS, // Gmail App Password (not regular password)
      },
    });

    // ✅ Send the email
    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`, // sender name and email
      to: email, // recipient
      subject: title, // email subject
      html: body, // email body (HTML format)
    });

    console.log("Email sent:", info.accepted);
    console.log("Response:", info.response);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

module.exports = mailSender;
