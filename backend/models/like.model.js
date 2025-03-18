import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }, // Reference to Profile collection
    createdAt: { type: Date, default: Date.now }
  });
  
export default mongoose.model('Like', likeSchema);