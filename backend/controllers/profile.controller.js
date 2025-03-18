import mongoose from "mongoose";
import cloudinary from '../config/cloudinary.js'
import Profile from "../models/profile.model.js";
import prisma from "../config/prisma.js";

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const profile = await Profile.findOne({ username }).select('userId username name bio profilePic');

        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        const loggedInProfile = await Profile.findOne({userId: req.user.userId});

        if (!loggedInProfile) {
            return res.status(404).json({ message: "Logged-in user not found" });
        }

        const userId = profile.userId;

        const followersCount = await prisma.follow.count({
            where: { followingId: parseInt(userId) }
        });

        const followingCount = await prisma.follow.count({
            where: { followerId: parseInt(userId) }
        });

        let profileType = '';
        if (username === loggedInProfile.username) {
            profileType = 'self';
        } else {
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

        res.json({
            user: {
                ...profile.toObject(),
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

export const updateProfile = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, bio } = req.body;

        const profile = await Profile.findOne({userId: req.user.userId}).session(session);

        if (!profile) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.name = name || profile.name;
        profile.bio = bio || profile.bio;

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

        await profile.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Profile update error:', error);
        res.status(error.status || 500).json({ message: error.message || "Error updating profile" });
    }
};