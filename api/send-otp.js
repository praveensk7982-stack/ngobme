import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // பழைய OTP இருந்தா delete பண்ணிட்டு புதுசா insert பண்ணுறது
  await supabase.from('otps').delete().eq('email', email);

  const { error: dbError } = await supabase.from('otps').insert({
    email,
    otp,
    expires_at: expiresAt
  });

  if (dbError) {
    console.error(dbError);
    return res.status(500).json({ error: 'Failed to save OTP' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your OTP Code - Tamil Nadu NGO Connect',
    text: `Your verification code is: ${otp}. It expires in 5 minutes.`
  });

  return res.status(200).json({ success: true, message: 'OTP sent' });
}