import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const ALLOWED_ROLES = ['seeker', 'agent'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, role, name, phone, agencyName } = req.body;

  // Basic required fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(403).json({ message: 'Invalid role specified' });
  }

  // Additional validation for agent role
  if (role === 'agent' && (!name || !phone || !agencyName)) {
    return res.status(400).json({
      message: 'Agent registration requires name, phone, and agencyName',
    });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      role,
    };

    if (role === 'agent') {
      userData.name = name;
      userData.phone = phone;
      userData.agencyName = agencyName;
    }

    const user = await User.create(userData);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...(role === 'agent' && {
          name: user.name,
          phone: user.phone,
          agencyName: user.agencyName,
        }),
      },
    });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
}
