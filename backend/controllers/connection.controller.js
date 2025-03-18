import prisma from "../config/prisma.js";
import Profile from "../models/profile.model.js";

export const follow = async (req, res) => {
  try {
    const { username } = req.body;
    const loggedInUserId = req.user.userId;

    await prisma.$transaction(async (prisma) => {
      const userToFollow = await prisma.user.findUnique({
        where: { username },
      });
      if (!userToFollow) {
        throw new Error("User to follow not found");
      }

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

  export const unfollow = async (req, res) => {
  try {
    const { username } = req.body;
    const loggedInUserId = req.user.userId;

    await prisma.$transaction(async (prisma) => {
      const userToUnfollow = await prisma.user.findUnique({
        where: { username },
      });
      if (!userToUnfollow) {
        throw new Error("User to unfollow not found");
      }

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

  export const getFollowersList = async (req, res) => {
    try {
      const { username } = req.params;
  
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const followers = await prisma.follow.findMany({
        where: { followingId: user.id },
        select: { followerId: true }
      });
  
      const followerIds = followers.map((f) => f.followerId);
  
      const followerProfiles = await Profile.find({ userId: { $in: followerIds } }).select("username name");
  
      res.json({ followers: followerProfiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting followers list" });
    }
  };

export const getFollowingList = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true }
    });

    const followingIds = following.map((f) => f.followingId);

    const followingProfiles = await Profile.find({ userId: { $in: followingIds } }).select("username name");

    res.json({ following: followingProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting following list" });
  }
};