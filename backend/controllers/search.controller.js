import Profile from "../models/profile.model.js";
import prisma from "../config/prisma.js";


export const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;

    const resultsByUsername = await prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const resultsByName = await Profile.find({
      name: { $regex: `^${query}`, $options: 'i' },
    }).select('userId name');

    const users = [];

    for (const user of resultsByUsername) {
      const profile = await Profile.findOne({ userId: user.id.toString() }).select('name');
      if (profile) {
        users.push({
          username: user.username,
          name: profile.name,
        });
      }
    }

    for (const profile of resultsByName) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(profile.userId) },
        select: { username: true },
      });
      if (user) {
        users.push({
          username: user.username,
          name: profile.name,
        });
      }
    }

    const uniqueUsers = Array.from(
      new Map(users.map(user => [user.username, user])).values()
    );

    res.status(200).json({ users: uniqueUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};