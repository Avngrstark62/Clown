import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const fetchPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { lastCreatedAt } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const query = {
            userId: { $in: user.following },
            deleted: false,
        };

        if (lastCreatedAt) {
            query.createdAt = { $lt: new Date(lastCreatedAt) };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const populatedPosts = await Promise.all(posts.map(async (post) => {
            const postUser = await User.findById(post.userId).select("username");
            return {
                ...post,
                username: postUser ? postUser.username : "Unknown",
            };
        }));

        let likedByUserList = [];
        for (let i = 0; i < populatedPosts.length; i++) {
          const likes = populatedPosts[i].likes.map((id) => id.toString());
          likedByUserList.push(likes.includes(userId));
        }

        res.status(200).json({ posts: populatedPosts, likedByUserList });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};