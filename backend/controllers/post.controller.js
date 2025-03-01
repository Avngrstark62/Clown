import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { content, media, tags, mentions } = req.body;

      const newPost = new Post({ userId, content, media, tags, mentions });
      await newPost.save();

      res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false })
      .populate('userId', 'username name profilePic')
      .populate('comments.userId', 'username name profilePic')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "All posts fetched successfully", posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all posts", error });
  }
};

export const viewPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId })
      .populate('userId', 'username name profilePic')
      .populate('comments.userId', 'username name profilePic');

    if (!post) {
      return res.status(404).json({ message: "Post not found on the database" });
    }
    
    res.status(200).json({ message: "Post viewed successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error viewing post", error });
  }
};