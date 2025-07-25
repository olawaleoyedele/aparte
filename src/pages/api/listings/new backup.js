import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import prisma from '@/lib/prisma';

// Disable default body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 🔐 Parse JWT from cookie
  const cookies = parseCookies({ req });
  const token = cookies.token || null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'agent') {
      return res.status(403).json({ message: 'Forbidden: Not an agent' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  // Create upload directory if not exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'File upload error' });
    }

    try {
      // Extract fields
      const {
        title,
        propertyDescription,
        location,
        price,
        paymentType,
        beds,
        baths,
        toilets,
        type,
      } = fields;

      // Normalize scalar values to strings/numbers
      const safeTitle = Array.isArray(title) ? title[0] : title;
      const safeDescription = Array.isArray(propertyDescription) ? propertyDescription[0] : propertyDescription;
      const safeLocation = Array.isArray(location) ? location[0] : location;
      const safePaymentType = Array.isArray(paymentType) ? paymentType[0] : paymentType;
      const safeType = Array.isArray(type) ? type[0] : type;

      const safeBeds = Array.isArray(beds) ? parseInt(beds[0]) : parseInt(beds);
      const safeBaths = Array.isArray(baths) ? parseInt(baths[0]) : parseInt(baths);
      const safeToilets = Array.isArray(toilets) ? parseInt(toilets[0]) : parseInt(toilets);

      // Normalize multi-select fields
      const amenities = Array.isArray(fields['amenities[]'])
        ? fields['amenities[]']
        : fields['amenities[]']
        ? [fields['amenities[]']]
        : [];

      const status = Array.isArray(fields['status[]'])
        ? fields['status[]']
        : fields['status[]']
        ? [fields['status[]']]
        : [];

      // Handle file uploads
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : files.images
        ? [files.images]
        : [];

      const videoFiles = Array.isArray(files.videos)
        ? files.videos
        : files.videos
        ? [files.videos]
        : [];

      const imageUrls = imageFiles.map((file) =>
        `/uploads/${path.basename(file.filepath)}`
      );

      const videoUrls = videoFiles.map((file) =>
        `/uploads/${path.basename(file.filepath)}`
      );

      // Save to database
      const newListing = await prisma.listing.create({
        data: {
          title: safeTitle,
          propertyDescription: safeDescription,
          location: safeLocation,
          price: parseInt(price),
          paymentType: safePaymentType,
          beds: safeBeds,
          baths: safeBaths,
          toilets: safeToilets,
          type: safeType,
          amenities,
          status,
          images: imageUrls,
          videos: videoUrls,
          agentEmail: decoded.email,
        },
      });

      return res.status(201).json({ message: 'Listing created', listing: newListing });
    } catch (error) {
      console.error('Error saving to DB:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
}
