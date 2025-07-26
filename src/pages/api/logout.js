import { serialize } from 'cookie';

export default function handler(req, res) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Only secure in production
    path: '/',
    expires: new Date(0),  // Expiry set to past to delete the cookie
    sameSite: 'None',  // Important if cross-origin cookies are used
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ success: true });
}
