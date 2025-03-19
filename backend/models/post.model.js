import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }, // Reference to Profile collection
  content: { type: String, default: "" },
  media: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  mentions: { type: [mongoose.Schema.Types.ObjectId], ref: 'Profile', default: [] }, // Reference to Profile collection
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);