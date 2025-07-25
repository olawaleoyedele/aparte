import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.agentEmail !== decoded.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.listing.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
