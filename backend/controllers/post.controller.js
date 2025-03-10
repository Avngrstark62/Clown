import cloudinary from '../config/cloudinary.js'
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from '../models/comment.model.js';
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'clown/posts' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }

        const newPost = new Post({
          userId: req.user.userId,
          content: req.body.content || "",
          media: [result.secure_url],
          // tags: [req.body.tags] || [],
          // mentions: [req.body.mentions] || []
        });

        const savedPost = await newPost.save();
        // res.status(201).json(savedPost);
        res.status(201).json({ message: "Post created successfully" });
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

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id
    
    const posts = await Post.find({ userId: userId, deleted: false });

    const loggedInUser = req.user.userId;

    let likedByUserList = [];
    for (let i = 0; i < posts.length; i++) {
      const index = posts[i].likes.indexOf(loggedInUser);
      if (index !== -1) {
        likedByUserList.push(true);
      } else {
        likedByUserList.push(false);
      }
    }    

    res.json({ posts, likedByUserList });
  } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;

    const deletedPost = await Post.findById(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!deletedPost.userId.equals(userId)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    deletedPost.deleted = true;

    await deletedPost.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;
  
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const index = post.likes.indexOf(userId);

    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }

    post.likesCount = post.likes.length;

    await post.save();

    const message = index !== -1 ? "Post unliked successfully" : "Post liked successfully";

    res.status(200).json({ post: post, message: message });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error: error.message });
  }
};

export const createComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;
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
      userId,
      commentType: "text",
      content,
      anonimous: anonimous,
      deleted: false,
    });

    await newComment.save({ session });

    post.commentsCount += 1;
    await post.save({ session });

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

    if (!comment.userId.equals(userId)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    comment.deleted = true;

    post.commentsCount = Math.max(post.commentsCount - 1, 0);

    await comment.save({ session });
    await post.save({ session });

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
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ post, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};