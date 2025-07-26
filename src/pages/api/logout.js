// pages/api/logout.js

import { serialize } from 'cookie';

export default function handler(req, res) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ success: true });
}
