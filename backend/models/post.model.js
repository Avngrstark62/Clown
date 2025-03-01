import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: { type: [String], default: [] },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentType: { type: String, enum: ['text', 'media'], required: true },
    content: { type: String, required: true },
    anonimous: { type: Boolean, default: true}
  }],
  tags: { type: [String], default: [] },
  mentions: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);