import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);