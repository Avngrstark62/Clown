import jwt from "jsonwebtoken";
import argon2 from "argon2";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import prisma from "../config/prisma.js";

// export const register = async (req, res) => {
//     try {
//       const { username, email, password } = req.body;
      
//       // // Check if user already exists
//       // const existingUser = await User.findOne({ email });
//       // if (existingUser) return res.status(400).json({ message: "Email already registered" });

//        // Check if email or username already exists
//        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//        if (existingUser) {
//          if (existingUser.email === email) {
//            return res.status(400).json({ message: "Email already registered" });
//          }
//          if (existingUser.username === username) {
//            return res.status(400).json({ message: "Username already taken" });
//          }
//        }
  
//       // Hash password using Argon2
//       const hashedPassword = await argon2.hash(password);
  
//       // Create user
//       const newUser = new User({ username, email, password: hashedPassword });
//       await newUser.save();
  
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Error during registration" });
//     }
//   }

export const register = async (req, res) => {
  let newUser = null;
  let newProfile = null;

  try {
    const { username, email, password } = req.body;

    // Check if email or username already exists in PostgreSQL
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

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

    // Phase 1: Create user in PostgreSQL
    newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    // Phase 1: Create profile in MongoDB
    newProfile = new Profile({
      userId: newUser.id.toString(), // Reference to PostgreSQL User ID
      username: newUser.username
    });

    await newProfile.save();

    // Phase 2: Commit (both operations succeeded)
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);

    // Phase 2: Rollback (if any operation failed)
    if (newUser) {
      // Rollback PostgreSQL: Delete the user
      await prisma.user.delete({ where: { id: newUser.id } }).catch((err) => {
        console.error("Failed to rollback PostgreSQL:", err);
      });
    }

    if (newProfile) {
      // Rollback MongoDB: Delete the profile
      await Profile.deleteOne({ _id: newProfile._id }).catch((err) => {
        console.error("Failed to rollback MongoDB:", err);
      });
    }

    res.status(500).json({ message: "Error during registration" });
  }
};

// export const login = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Find user
//       const user = await User.findOne({ email });
//       if (!user) return res.status(400).json({ message: "No account with this email exists." });
  
//       // Verify password
//       const isPasswordValid = await argon2.verify(user.password, password);
//       if (!isPasswordValid) return res.status(400).json({ message: "Incorrect Password" });
  
//       // Generate JWT token
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
  
//       // Send token in HTTP-only cookie
//       // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 7 * 24 * 60 * 60 * 1000 });
//       res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });

//       res.json({ message: "Login successful" });
//     } catch (error) {
//       res.status(500).json({ message: "Error logging in" });
//     }
//   }

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email)

    // Find user in PostgreSQL
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "No account with this email exists." });
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  }

// export const user = async (req, res) => {
//   const userId = req.user.userId
//   const user = await User.findById(userId);
//   res.json({ user: user.username});
// }

export const user = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from the JWT token

    // Fetch user from PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }, // Convert userId to integer
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return combined user and profile data
    res.json({ user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};