import admin from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const userRecord = await admin.auth().getUserByEmail(cleanEmail);

    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful!'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }
    return res.status(500).json({ error: err.message || 'Failed to reset password. Please try again.' });
  }
}
