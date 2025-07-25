// src/lib/db.js
import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Recommended
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null; // Reset on failure
    throw err;
  }
}

// Prevent hot reload memory leaks
if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}
