import Profile from "../models/profile.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import prisma from "../config/prisma.js"

export const fetchPosts = async (req, res) => {
    try {
        const userId = req.user.userId; // PostgreSQL user ID
        const { lastCreatedAt } = req.query;

        // First, get the user's profile from MongoDB
        const userProfile = await Profile.findOne({ userId: userId });
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Fetch the list of profiles the user is following from PostgreSQL
        const followingRelations = await prisma.follow.findMany({
            where: { followerId: parseInt(userId) },
            select: { followingId: true },
        });

        // Extract the list of profile IDs the user is following
        const followingUserIds = followingRelations.map(
            (relation) => relation.followingId.toString()
        );

        let followingProfileIds = [];

        for(let i=0;i<followingUserIds.length;i++){
            const profile = await Profile.findOne({ userId: followingUserIds[i] });
            followingProfileIds.push(profile._id)
        }

        console.log(followingUserIds);

        // Build the query for posts
        const query = {
            profileId: { $in: followingProfileIds },
            deleted: false,
        };


        if (lastCreatedAt) {
            query.createdAt = { $lt: new Date(lastCreatedAt) };
        }

        // Fetch posts
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Get a list of post IDs
        const postIds = posts.map(post => post._id);

        // Find likes by the current user for these posts
        const userLikes = await Like.find({
            postId: { $in: postIds },
            profileId: userProfile._id
        }).select('postId');

        // Create a set of post IDs that the user has liked for quick lookup
        const likedPostIds = new Set(userLikes.map(like => like.postId.toString()));

        // Populate posts with profile information and add likedByUser field
        const populatedPosts = await Promise.all(posts.map(async (post) => {
            const postProfile = await Profile.findById(post.profileId).select("name userId");
            const likesCount = await Like.countDocuments({ postId: post._id });
            
            return {
                ...post,
                profileName: postProfile ? postProfile.name : "Unknown",
                likedByUser: likedPostIds.has(post._id.toString()),
                likesCount: likesCount,
            };
        }));

        res.status(200).json({ posts: populatedPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};