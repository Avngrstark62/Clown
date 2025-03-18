import User from "../models/user.model.js"
import prisma from "../config/prisma.js";
import Profile from "../models/profile.model.js";

// export const follow = async (req, res) => {
//     try {
//       const { username } = req.body;
//       const userToFollow = await User.findOne({ username });
//       if (!userToFollow) return res.status(404).json({ message: "UserToFollow not found" });

//       const loggedInUser = await User.findById(req.user.userId);
//       if (!loggedInUser) return res.status(404).json({ message: "loggedInUser not found" });

//       if (!loggedInUser.following.includes(userToFollow._id)) {
//         loggedInUser.following.push(userToFollow._id);
//         loggedInUser.followingCount += 1;
//       }

//       if (!userToFollow.followers.includes(loggedInUser._id)) {
//         userToFollow.followers.push(loggedInUser._id);
//         userToFollow.followersCount += 1;
//       }
      
//       await loggedInUser.save();
//       await userToFollow.save();
  
//       res.status(201).json({ message: "User followed successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Error following user" });
//     }
//   };

export const follow = async (req, res) => {
  try {
    const { username } = req.body;
    const loggedInUserId = req.user.userId;

    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Find the user to follow
      const userToFollow = await prisma.user.findUnique({
        where: { username },
      });
      if (!userToFollow) {
        throw new Error("User to follow not found");
      }

      // Check if the follow relationship already exists
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: loggedInUserId,
            followingId: userToFollow.id,
          },
        },
      });

      if (existingFollow) {
        throw new Error("Already following this user");
      }

      // Create the follow relationship
      await prisma.follow.create({
        data: {
          followerId: loggedInUserId,
          followingId: userToFollow.id,
        },
      });
    });

    res.status(201).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error following user" });
  }
};

  // export const unfollow = async (req, res) => {
  //   try {
  //     const { username } = req.body;
  //     const userToUnFollow = await User.findOne({ username });
  //     if (!userToUnFollow) return res.status(404).json({ message: "userToUnFollow not found" });

  //     const loggedInUser = await User.findById(req.user.userId);
  //     if (!loggedInUser) return res.status(404).json({ message: "loggedInUser not found" });

  //     if (loggedInUser.following.includes(userToUnFollow._id)) {
  //       loggedInUser.following = loggedInUser.following.filter(item => item.toString() !== userToUnFollow._id.toString());
  //       loggedInUser.followingCount -= 1;
  //     }

  //     if (userToUnFollow.followers.includes(loggedInUser._id)) {
  //       userToUnFollow.followers = userToUnFollow.followers.filter(item => item.toString() !== loggedInUser._id.toString());
  //       userToUnFollow.followersCount -= 1;
  //     }
      
  //     await loggedInUser.save();
  //     await userToUnFollow.save();
  
  //     res.status(201).json({ message: "User unfollowed successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: "Error following user" });
  //   }
  // };

  export const unfollow = async (req, res) => {
  try {
    const { username } = req.body;
    const loggedInUserId = req.user.userId;

    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Find the user to unfollow
      const userToUnfollow = await prisma.user.findUnique({
        where: { username },
      });
      if (!userToUnfollow) {
        throw new Error("User to unfollow not found");
      }

      // Check if the follow relationship exists
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: loggedInUserId,
            followingId: userToUnfollow.id,
          },
        },
      });

      if (!existingFollow) {
        throw new Error("Not following this user");
      }

      // Delete the follow relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: loggedInUserId,
            followingId: userToUnfollow.id,
          },
        },
      });
    });

    res.status(201).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error unfollowing user" });
  }
};

  // export const getFollowersList = async (req, res) => {
  //     try {
  //       const { username } = req.params;

  //       const user = await User.findOne({ username });

  //       if (!user) {
  //           return res.status(404).json({ message: "User not found" });
  //       }
        
  //       const followers = await User.find({ _id: { $in: user.followers } }).select("username name");

  //       res.json({ followers });
  //     } catch (error) {
  //         res.status(500).json({ message: "Error getting followers list" });
  //     }
  // };

  export const getFollowersList = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Step 1: Fetch the user from PostgreSQL
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true } // Only fetch the user's ID
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Step 2: Fetch the followers from PostgreSQL
      const followers = await prisma.follow.findMany({
        where: { followingId: user.id }, // Users who are following this user
        select: { followerId: true } // Only fetch the follower IDs
      });
  
      // Extract follower IDs
      const followerIds = followers.map((f) => f.followerId);
  
      // Step 3: Fetch the corresponding profiles from MongoDB
      const followerProfiles = await Profile.find({ userId: { $in: followerIds } }).select("username name");
  
      res.json({ followers: followerProfiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting followers list" });
    }
  };

//   export const getFollowingList = async (req, res) => {
//     try {
//         const { username } = req.params;

//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const following = await User.find({ _id: { $in: user.following } }).select("username name");

//         res.json({ following });
//     } catch (error) {
//         res.status(500).json({ message: "Error getting following list" });
//     }
// };

export const getFollowingList = async (req, res) => {
  try {
    const { username } = req.params;

    // Step 1: Fetch the user from PostgreSQL
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true } // Only fetch the user's ID
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Fetch the following from PostgreSQL
    const following = await prisma.follow.findMany({
      where: { followerId: user.id }, // Users this user is following
      select: { followingId: true } // Only fetch the following IDs
    });

    // Extract following IDs
    const followingIds = following.map((f) => f.followingId);

    // Step 3: Fetch the corresponding profiles from MongoDB
    const followingProfiles = await Profile.find({ userId: { $in: followingIds } }).select("username name");

    res.json({ following: followingProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting following list" });
  }
};