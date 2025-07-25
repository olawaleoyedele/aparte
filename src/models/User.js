// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  agencyName: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['seeker', 'agent'],
    required: true,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
