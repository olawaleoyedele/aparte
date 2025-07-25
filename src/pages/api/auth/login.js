import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await connectDB();

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, agencyName: user.agencyName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // 1-day expiry
    );

    // Set the token in the cookie (HttpOnly, SameSite, Secure if in production)
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);

    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error('API /login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
