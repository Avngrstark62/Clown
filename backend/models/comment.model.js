import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   commentType: { type: String, enum: ['text', 'media'], required: true },
//   anonimous: { type: Boolean, default: false },
//   deleted: { type: Boolean, default: false }
// }, { 
//   timestamps: true 
// });

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }, // Reference to Profile collection
  content: { type: String, required: true },
  commentType: { type: String, enum: ['text', 'media'], required: true },
  anonimous: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

export default mongoose.model('Comment', commentSchema);