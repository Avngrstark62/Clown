import jwt from "jsonwebtoken";
import argon2 from "argon2";
import User from "../models/user.model.js"

export const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // // Check if user already exists
      // const existingUser = await User.findOne({ email });
      // if (existingUser) return res.status(400).json({ message: "Email already registered" });

       // Check if email or username already exists
       const existingUser = await User.findOne({ $or: [{ email }, { username }] });
       if (existingUser) {
         if (existingUser.email === email) {
           return res.status(400).json({ message: "Email already registered" });
         }
         if (existingUser.username === username) {
           return res.status(400).json({ message: "Username already taken" });
         }
       }
  
      // Hash password using Argon2
      const hashedPassword = await argon2.hash(password);
  
      // Create user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error during registration" });
    }
  }

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // console.log(email, password)
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "No account with this email exists." });
  
      // Verify password
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) return res.status(400).json({ message: "Incorrect Password" });
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
  
      // Send token in HTTP-only cookie
      // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
      res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "None" });

      res.json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  }

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  }

export const user = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId);
  res.json({ user: user.username});
}
