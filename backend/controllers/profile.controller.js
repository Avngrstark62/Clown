import User from "../models/user.model.js"
import cloudinary from '../config/cloudinary.js'

export const getUserData = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select('username name bio followersCount followingCount profilePic');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const loggedInUser = await User.findById(req.user.userId);

        let profileType = '';
        if (username === loggedInUser.username) {
            profileType = 'self';
        } else {
            if (loggedInUser.following.includes(user._id)) {
                profileType = 'following';
            }
            else{
              profileType = 'non-following';
            }
        }
        
        res.json({ user, profileType });
    } catch (error) {
        res.status(500).json({ message: "Error fetching other_user_data" });
    }
};

export const updateUserData = async (req, res) => {
  try {
    const { username, name, bio } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && username !== user.username) {
      return res.status(400).json({ message: "Username already taken" });
    }

    user.username = username || user.username;
    user.name = name || user.name;
    user.bio = bio || user.bio;

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

      user.profilePic = result.secure_url;
    }

    await user.save();

    res.status(200).json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: "Error updating user data" });
  }
};