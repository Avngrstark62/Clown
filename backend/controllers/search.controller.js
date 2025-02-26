import User from "../models/user.model.js"

export const searchUsers = async (req, res) => {
    try {
      const { query } = req.body;

      const users = [
        { id: 1, username: 'john_doe', name: 'John Doe' },
        { id: 2, username: 'jane_smith', name: 'Jane Smith' },
        { id: 3, username: 'avngr_stark', name: 'Abhijeet Singh Thakur' },
        { id: 4, username: 'abhijeetst22', name: 'Abhijeet Singh' }
      ]
  
      res.status(201).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error searching users" });
    }
  }