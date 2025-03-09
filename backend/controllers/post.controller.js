import cloudinary from '../config/cloudinary.js'
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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
    
    const posts = await Post.find({ userId: userId });

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

    const deletedPost = await Post.findOneAndDelete({ _id: postId, userId });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

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