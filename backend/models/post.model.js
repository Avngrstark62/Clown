import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: "" },
  media: { type: [String], default: [] },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  mentions: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);