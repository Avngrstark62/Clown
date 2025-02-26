import User from "../models/user.model.js"

export const follow = async (req, res) => {
    try {
      const { username } = req.body;
      const userToFollow = await User.findOne({ username });
      if (!userToFollow) return res.status(404).json({ message: "UserToFollow not found" });

      const loggedInUser = await User.findById(req.user.userId);
      if (!loggedInUser) return res.status(404).json({ message: "loggedInUser not found" });

      if (!loggedInUser.following.includes(userToFollow._id)) {
        loggedInUser.following.push(userToFollow._id);
        loggedInUser.followingCount += 1;
      }

      if (!userToFollow.followers.includes(loggedInUser._id)) {
        userToFollow.followers.push(loggedInUser._id);
        userToFollow.followersCount += 1;
      }
      
      await loggedInUser.save();
      await userToFollow.save();
  
      res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error following user" });
    }
  };

  export const unfollow = async (req, res) => {
    try {
      const { username } = req.body;
      const userToUnFollow = await User.findOne({ username });
      if (!userToUnFollow) return res.status(404).json({ message: "userToUnFollow not found" });

      const loggedInUser = await User.findById(req.user.userId);
      if (!loggedInUser) return res.status(404).json({ message: "loggedInUser not found" });

      if (loggedInUser.following.includes(userToUnFollow._id)) {
        loggedInUser.following = loggedInUser.following.filter(item => item.toString() !== userToUnFollow._id.toString());
        loggedInUser.followingCount -= 1;
      }

      if (userToUnFollow.followers.includes(loggedInUser._id)) {
        userToUnFollow.followers = userToUnFollow.followers.filter(item => item.toString() !== loggedInUser._id.toString());
        userToUnFollow.followersCount -= 1;
      }
      
      await loggedInUser.save();
      await userToUnFollow.save();
  
      res.status(201).json({ message: "User unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error following user" });
    }
  };

  export const getFollowersList = async (req, res) => {
      try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const followers = await User.find({ _id: { $in: user.followers } }).select("username name");

        res.json({ followers });
      } catch (error) {
          res.status(500).json({ message: "Error getting followers list" });
      }
  };

  export const getFollowingList = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const following = await User.find({ _id: { $in: user.following } }).select("username name");

        res.json({ following });
    } catch (error) {
        res.status(500).json({ message: "Error getting following list" });
    }
};