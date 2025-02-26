import User from "../models/user.model.js"

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password -createdAt -updatedAt');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user_data" });
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
      if (existingUser && username!=user.username) return res.status(400).json({ message: "Username Already taken" });

      user.username = username;
      user.name = name;
      user.bio = bio;

      await user.save();
  
      res.status(201).json({ message: "UserData updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating userData" });
    }
  }