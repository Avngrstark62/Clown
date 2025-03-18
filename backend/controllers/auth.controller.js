import jwt from "jsonwebtoken";
import argon2 from "argon2";
import Profile from "../models/profile.model.js";
import prisma from "../config/prisma.js";

export const register = async (req, res) => {
  let newUser = null;
  let newProfile = null;

  try {
    const { username, email, password } = req.body;

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

    const hashedPassword = await argon2.hash(password);

    newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    newProfile = new Profile({
      userId: newUser.id.toString(),
      username: newUser.username
    });

    await newProfile.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);

    if (newUser) {
      await prisma.user.delete({ where: { id: newUser.id } }).catch((err) => {
        console.error("Failed to rollback PostgreSQL:", err);
      });
    }

    if (newProfile) {
      await Profile.deleteOne({ _id: newProfile._id }).catch((err) => {
        console.error("Failed to rollback MongoDB:", err);
      });
    }

    res.status(500).json({ message: "Error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email)

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "No account with this email exists." });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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

export const user = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};