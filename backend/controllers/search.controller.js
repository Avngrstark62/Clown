import User from "../models/user.model.js"

export const searchUsers = async (req, res) => {
    try {
      const { query } = req.body;

      const results_by_username = await User.find({ username: { $regex: `^${query}`, $options: 'i' }}).select('username name');
      const results_by_name = await User.find({ name: { $regex: `^${query}`, $options: 'i' }}).select('username name');
      const users = [...results_by_username, ...results_by_name];

      const uniqueUsers = Array.from(
        new Map(users.map(user => [user.username, user])).values()
    );    
      
      res.status(201).json({ users: uniqueUsers });
    } catch (error) {
      res.status(500).json({ message: "Error searching users" });
    }
  }