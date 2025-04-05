import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendmail = async (to, subject, html) =>{

  try {
    await transporter.sendMail({
      from: `"elite 🚀" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📨 Mail envoyé à ${to}`);
  } catch (err) {
    console.error("❌ Échec de l’envoi de mail :", err);
  }
}


