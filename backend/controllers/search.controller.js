// import User from "../models/user.model.js"

// export const searchUsers = async (req, res) => {
//     try {
//       const { query } = req.body;

//       const results_by_username = await User.find({ username: { $regex: `^${query}`, $options: 'i' }}).select('username name');
//       const results_by_name = await User.find({ name: { $regex: `^${query}`, $options: 'i' }}).select('username name');
//       const users = [...results_by_username, ...results_by_name];

//       const uniqueUsers = Array.from(
//         new Map(users.map(user => [user.username, user])).values()
//     );    
      
//       res.status(201).json({ users: uniqueUsers });
//     } catch (error) {
//       res.status(500).json({ message: "Error searching users" });
//     }
//   }

import { PrismaClient } from '@prisma/client'; // For PostgreSQL User table
import Profile from "../models/profile.model.js"; // For MongoDB Profile collection

const prisma = new PrismaClient();

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;

    // Step 1: Search for users by username in PostgreSQL (authentication data)
    const resultsByUsername = await prisma.user.findMany({
      where: {
        username: {
          startsWith: query, // Case-sensitive search
          mode: 'insensitive', // Case-insensitive search
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Step 2: Search for users by name in MongoDB (profile data)
    const resultsByName = await Profile.find({
      name: { $regex: `^${query}`, $options: 'i' }, // Case-insensitive regex search
    }).select('userId name');

    // Step 3: Combine results from both databases
    const users = [];

    // Add results from PostgreSQL (username search)
    for (const user of resultsByUsername) {
      const profile = await Profile.findOne({ userId: user.id.toString() }).select('name');
      if (profile) {
        users.push({
          username: user.username,
          name: profile.name,
        });
      }
    }

    // Add results from MongoDB (name search)
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

    // Step 4: Remove duplicate users
    const uniqueUsers = Array.from(
      new Map(users.map(user => [user.username, user])).values()
    );

    // Step 5: Send response
    res.status(200).json({ users: uniqueUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};