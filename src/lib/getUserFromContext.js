// lib/getUserFromContext.js
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export function getUserFromContext(context) {
  const { token } = parseCookies(context);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      name: decoded.name || '',
      email: decoded.email || '',
      role: decoded.role || '',
    };
  } catch {
    return null;
  }
}
