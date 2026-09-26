import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP required' });
  }

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(400).json({ success: false, message: 'OTP not found. Request again.' });
  }

  if (new Date() > new Date(data.expires_at)) {
    await supabase.from('otps').delete().eq('email', email);
    return res.status(400).json({ success: false, message: 'OTP expired.' });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Wrong OTP.' });
  }

  await supabase.from('otps').delete().eq('email', email);

  return res.status(200).json({ success: true, message: 'Verified!' });
}