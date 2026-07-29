import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

router.post('/send-inquiry', async (req, res) => {
  // Initialize Resend inside the request handler
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { from_name, from_email, subject, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Hospital Inquiry <onboarding@resend.dev>',
      to: ['ac984939@gmail.com'], // Ensure this matches your Resend login email
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

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send inquiry email.' });
  }
});

export default router;