import nodemailer from "nodemailer"
import env from "dotenv"

env.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEMail = async (email,subject,content) => {
  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <rohits502010@gmail.com>',
      to: email,
      subject: subject,
      html: content,
    });
    console.log("Email Sent");
  } catch (error) {
    console.log("Error in sending mail:", error.message);
  }
};

///////   mail verification token ////////