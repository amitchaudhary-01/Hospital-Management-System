import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

let smtpHost = 'smtp.gmail.com';
try {
  const addresses = await dns.promises.resolve4('smtp.gmail.com');
  if (addresses.length) smtpHost = addresses[0];
} catch {
  // fall back to the hostname
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: 465,
  secure: true,
  servername: 'smtp.gmail.com',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 60000,
});

router.post('/send-inquiry', async (req, res) => {
  const { from_name, from_email, subject, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    await transporter.sendMail({
      from: `"Hospital Inquiry" <${process.env.GMAIL_USER}>`,
      to: 'ac984939@gmail.com',
      replyTo: from_email,
      subject: subject || `New Patient Inquiry from ${from_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${from_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Department / Subject:</strong> ${subject || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send inquiry email.' });
  }
});

export default router;
