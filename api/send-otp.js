import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import admin from './firebaseAdmin.js';

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

  try {
    await admin.auth().getUserByEmail(email);
    return res.status(409).json({
      error: 'This email is already registered. Please login instead.'
    });
  } catch (err) {
    if (err.code !== 'auth/user-not-found') {
      console.error('Firebase check error:', err);
      return res.status(500).json({ error: 'Something went wrong. Try again.' });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

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

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Tamil Nadu NGO Connect" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Verification Code - Tamil Nadu NGO Connect',
      text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: Arial, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #0d9488, #0891b2); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Tamil Nadu NGO Connect</h1>
          </div>
          <div style="padding: 32px 24px; text-align: center;">
            <p style="color: #334155; font-size: 15px; margin-bottom: 8px;">Hello,</p>
            <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">Your 6-digit verification code is:</p>
            <div style="display: inline-block; padding: 16px 32px; background: #f0fdfa; border: 2px dashed #0d9488; border-radius: 10px; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0d9488;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 13px;">This code will expire in <strong>5 minutes</strong>.</p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">Together for a Better Tomorrow — Tamil Nadu NGO Connect</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'OTP sent' });

  } catch (mailErr) {
    console.error('SMTP send error:', mailErr);
    return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
  }
}