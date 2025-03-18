import cloudinary from '../config/cloudinary.js'
import Post from "../models/post.model.js";
import Comment from '../models/comment.model.js';
import mongoose from "mongoose";
import Profile from "../models/profile.model.js";
import Like from '../models/like.model.js';

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const profile = await Profile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'clown/posts' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }

        const newPost = new Post({
          profileId: profile._id,
          content: req.body.content || "",
          media: [result.secure_url],
          // tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
          // mentions: req.body.mentions ? JSON.parse(req.body.mentions) : [],
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: savedPost });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const fetchUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileId = profile._id;

    const posts = await Post.find({ profileId: profileId, deleted: false });

    const loggedInProfile = await Profile.findOne({ userId: req.user.userId });
    const loggedInProfileId = loggedInProfile._id;

    const postsWithMoreDetails = await Promise.all(
      posts.map(async (post) => {
        const likedByUser = await Like.exists({ postId: post._id, profileId: loggedInProfileId });
        const likesCount = await Like.countDocuments({ postId: post._id });
        return {
          ...post.toObject(),
          likedByUser: !!likedByUser,
          likesCount: likesCount,
        };
      })
    );

    res.json({ posts: postsWithMoreDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileId = profile._id;

    const deletedPost = await Post.findById(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!deletedPost.profileId.equals(profileId)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    deletedPost.deleted = true;

    await deletedPost.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileId = profile._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ postId: post._id, profileId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      await post.save();

      return res.status(200).json({ message: "Post unliked successfully", post: post });
    } else {
      const newLike = new Like({
        postId: post._id,
        profileId,
      });

      await newLike.save();

      await post.save();

      return res.status(200).json({ message: "Post liked successfully", post: post });
    }
  } catch (error) {
    console.error("Error liking post: ", error);
    res.status(500).json({ message: "Error liking post", error: error.message });
  }
};

export const createComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileId = profile._id;

    let { postId, content, anonimous = false } = req.body;

    content = content?.trim();

    if (!content) {
      await session.endSession();
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    
    if (content.length > 1000) {
      await session.endSession();
      return res.status(400).json({ message: "Content exceeds maximum length (1000 characters)" });
    }

    const post = await Post.findById(postId).session(session);

    if (!post) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      postId,
      profileId,
      commentType: "text",
      content,
      anonimous: anonimous,
      deleted: false,
    });

    await newComment.save({ session });

    await session.commitTransaction();
    
    res.status(201).json({ 
      message: "Comment created successfully", 
      comment: newComment 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating comment:", error);
    res.status(500).json({ 
      message: "Error creating comment", 
      error: error.message || "Unknown error occurred" 
    });
  } finally {
    session.endSession();
  }
};

export const deleteComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileId = profile._id;

    const { postId, commentId } = req.body;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      await session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    const post = await Post.findById(postId).session(session);
    const comment = await Comment.findById(commentId).session(session);

    if (!comment || comment.deleted) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Comment not found or already deleted" });
    }

    if (!comment.profileId.equals(profileId)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    comment.deleted = true;

    await comment.save({ session });
    
    await session.commitTransaction();

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting comment:", error);
    res.status(500).json({ 
      message: "Error deleting comment", 
      error: error.message || "Unknown error occurred" 
    });
  } finally {
    session.endSession();
  }
};

export const fetchPostAndComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    const comments = await Comment.find({ postId, deleted: false })
      .populate('profileId', 'username profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ post, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};