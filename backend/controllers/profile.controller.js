import User from "../models/user.model.js"
import mongoose from "mongoose";
import cloudinary from '../config/cloudinary.js'
import Profile from "../models/profile.model.js"; // MongoDB Profile collection
import prisma from "../config/prisma.js"; // PostgreSQL Prisma client

// export const getProfile = async (req, res) => {
//     try {
//         const { username } = req.params;

//         const user = await User.findOne({ username }).select('username name bio followersCount followingCount profilePic');

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const loggedInUser = await User.findById(req.user.userId);

//         let profileType = '';
//         if (username === loggedInUser.username) {
//             profileType = 'self';
//         } else {
//             if (loggedInUser.following.includes(user._id)) {
//                 profileType = 'following';
//             }
//             else{
//               profileType = 'non-following';
//             }
//         }
        
//         res.json({ user, profileType });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching other_user_data" });
//     }
// };

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Step 1: Fetch the profile from MongoDB
        const profile = await Profile.findOne({ username }).select('userId username name bio profilePic');

        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 2: Fetch the logged-in user's profile from MongoDB
        const loggedInProfile = await Profile.findOne({userId: req.user.userId});

        if (!loggedInProfile) {
            return res.status(404).json({ message: "Logged-in user not found" });
        }

        // Step 3: Calculate follower and following counts using PostgreSQL
        const userId = profile.userId; // Reference to PostgreSQL User table

        // Fetch follower count
        const followersCount = await prisma.follow.count({
            where: { followingId: parseInt(userId) }
        });

        // Fetch following count
        const followingCount = await prisma.follow.count({
            where: { followerId: parseInt(userId) }
        });

        // Step 4: Determine the profile type (self, following, non-following)
        let profileType = '';
        if (username === loggedInProfile.username) {
            profileType = 'self';
        } else {
            // Check if the logged-in user is following this profile
            const isFollowing = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: parseInt(loggedInProfile.userId),
                        followingId: parseInt(userId)
                    }
                }
            });

            profileType = isFollowing ? 'following' : 'non-following';
        }

        // Step 5: Return the response
        res.json({
            user: {
                ...profile.toObject(), // MongoDB profile data
                followersCount,
                followingCount
            },
            profileType
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching profile data" });
    }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { username, name, bio } = req.body;
//     const userId = req.user.userId;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const existingUser = await User.findOne({ username });
//     if (existingUser && username !== user.username) {
//       return res.status(400).json({ message: "Username already taken" });
//     }

//     user.username = username || user.username;
//     user.name = name || user.name;
//     user.bio = bio || user.bio;

//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'clown/profiles' },
//           (error, result) => {
//             if (error) {
//               console.error('Cloudinary upload error:', error);
//               return reject({ status: 500, message: 'Image upload failed' });
//             }
//             resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });

//       user.profilePic = result.secure_url;
//     }

//     await user.save();

//     res.status(200).json({ message: "User data updated successfully", user });
//   } catch (error) {
//     console.error('User update error:', error);
//     res.status(500).json({ message: "Error updating user data" });
//   }
// };

export const updateProfile = async (req, res) => {
    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction(); // Start a transaction

    try {
        const { name, bio } = req.body;

        // Step 1: Fetch the profile from MongoDB
        const profile = await Profile.findOne({userId: req.user.userId}).session(session);

        if (!profile) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Profile not found" });
        }

        // Step 2: Update profile fields
        profile.name = name || profile.name;
        profile.bio = bio || profile.bio;

        // Step 3: Handle profile picture upload (if a file is provided)
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'clown/profiles' },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            return reject({ status: 500, message: 'Image upload failed' });
                        }
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            profile.profilePic = result.secure_url;
        }

        // Step 4: Save the updated profile
        await profile.save({ session });

        // Step 5: Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Step 6: Return the response
        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        // Step 7: Roll back the transaction in case of an error
        await session.abortTransaction();
        session.endSession();

        console.error('Profile update error:', error);
        res.status(error.status || 500).json({ message: error.message || "Error updating profile" });
    }
};