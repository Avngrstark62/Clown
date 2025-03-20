  import mongoose from 'mongoose';
  
  const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Reference to PostgreSQL User table
    username: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    bio: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    gender: { type: String, default: '' },
    dob: { type: String, default: '' },
    interests: { type: [String], default: [] },
    country: { type: String, default: '' },
  }, {
    timestamps: true
  });
  
  export default mongoose.model('Profile', profileSchema);