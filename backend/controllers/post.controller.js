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
        res.status(201).json(savedPost);
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

    res.json({ posts });
  } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
  }
};