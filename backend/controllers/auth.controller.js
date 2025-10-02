import jwt from "jsonwebtoken";
import argon2 from "argon2";
import Profile from "../models/profile.model.js";
import prisma from "../config/prisma.js";
import emailService from "../utils/emailService.js"
// import sgMail from "@sendgrid/mail";

// Set SendGrid API key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Utility to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register Step 1: Validate user info and send OTP
export const initiateRegister = async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    // Check if user already exists
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

    // Hash the password
    const hashedPassword = await argon2.hash(password);
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store user data in JWT token (temporary storage)
    const token = jwt.sign(
      { 
        username, 
        email, 
        password: hashedPassword, 
        otp,
        exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes expiration
      }, 
      process.env.JWT_SECRET
    );

    // Send OTP via SendGrid
    // const msg = {
    //   to: email,
    //   from: process.env.SENDGRID_FROM_EMAIL, // Verified sender in SendGrid
    //   subject: 'Your OTP for registration',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2>Welcome to Clown App!</h2>
    //       <p>Your one-time password for registration is:</p>
    //       <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
    //       <p>This code will expire in 15 minutes.</p>
    //       <p>If you didn't request this code, please ignore this email.</p>
    //     </div>
    //   `
    // };

    await emailService.sendOTPEmail(email, otp);

    // await sgMail.send(msg);

    // Send token to client
    res.status(200).json({ 
      message: "OTP sent to your email",
      token,
      email // Include email to display on frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};

// Resend OTP if needed
export const resendOTP = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Registration session expired. Please try again." });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    
    // Create new token with new OTP
    const newToken = jwt.sign(
      { 
        username: decoded.username, 
        email: decoded.email, 
        password: decoded.password, 
        otp,
        exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes expiration
      }, 
      process.env.JWT_SECRET
    );

    // Send OTP via SendGrid
    // const msg = {
    //   to: decoded.email,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: 'Your new OTP for registration',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2>Welcome to Clown App!</h2>
    //       <p>Your new one-time password for registration is:</p>
    //       <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
    //       <p>This code will expire in 15 minutes.</p>
    //       <p>If you didn't request this code, please ignore this email.</p>
    //     </div>
    //   `
    // };

    await emailService.sendOTPEmail(email, otp);

    // await sgMail.send(msg);

    // Send token to client
    res.status(200).json({ 
      message: "New OTP sent to your email",
      token: newToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP" });
  }
};

// The verifyAndRegister, login, logout, and user functions remain unchanged

// import jwt from "jsonwebtoken";
// import argon2 from "argon2";
// import Profile from "../models/profile.model.js";
// import prisma from "../config/prisma.js";
// import nodemailer from "nodemailer";

// // Utility to generate OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//   // Configure your email service here
//   service: "gmail", // or any other service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Register Step 1: Validate user info and send OTP
// export const initiateRegister = async (req, res) => {
//   try {
//     const username = req.body.username.toLowerCase();
//     const email = req.body.email.toLowerCase();
//     const password = req.body.password;

//     // Check if user already exists
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { email },
//           { username }
//         ]
//       }
//     });

//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: "Email already registered" });
//       }
//       if (existingUser.username === username) {
//         return res.status(400).json({ message: "Username already taken" });
//       }
//     }

//     // Hash the password
//     const hashedPassword = await argon2.hash(password);
    
//     // Generate OTP
//     const otp = generateOTP();
    
//     // Store user data in JWT token (temporary storage)
//     const token = jwt.sign(
//       { 
//         username, 
//         email, 
//         password: hashedPassword, 
//         otp,
//         exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes expiration
//       }, 
//       process.env.JWT_SECRET
//     );

//     // Send OTP via email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP for registration',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Welcome to Clown App!</h2>
//           <p>Your one-time password for registration is:</p>
//           <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
//           <p>This code will expire in 15 minutes.</p>
//           <p>If you didn't request this code, please ignore this email.</p>
//         </div>
//       `
//     };

//     await transporter.sendMail(mailOptions);

//     // Send token to client
//     res.status(200).json({ 
//       message: "OTP sent to your email",
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error during registration" });
//   }
// };

// // Resend OTP if needed
// export const resendOTP = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     // Verify the token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ message: "Registration session expired. Please try again." });
//     }
    
//     // Generate new OTP
//     const otp = generateOTP();
    
//     // Create new token with new OTP
//     const newToken = jwt.sign(
//       { 
//         username: decoded.username, 
//         email: decoded.email, 
//         password: decoded.password, 
//         otp,
//         exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes expiration
//       }, 
//       process.env.JWT_SECRET
//     );

//     // Send OTP via email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: decoded.email,
//       subject: 'Your new OTP for registration',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Welcome to Clown App!</h2>
//           <p>Your new one-time password for registration is:</p>
//           <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
//           <p>This code will expire in 15 minutes.</p>
//           <p>If you didn't request this code, please ignore this email.</p>
//         </div>
//       `
//     };

//     await transporter.sendMail(mailOptions);

//     // Send token to client
//     res.status(200).json({ 
//       message: "New OTP sent to your email",
//       token: newToken
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error resending OTP" });
//   }
// };

// Register Step 2: Verify OTP and create user
export const verifyAndRegister = async (req, res) => {
  try {
    const { token, otp } = req.body;
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Registration session expired. Please try again." });
    }
    
    // Check if OTP matches
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    let newUser = null;
    let newProfile = null;

    try {
      // Create user in database
      newUser = await prisma.user.create({
        data: {
          username: decoded.username,
          email: decoded.email,
          password: decoded.password
        }
      });

      // Create user profile
      newProfile = new Profile({
        userId: newUser.id.toString(),
        username: newUser.username
      });

      await newProfile.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);

      // Rollback if needed
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};


// import jwt from "jsonwebtoken";
// import argon2 from "argon2";
// import Profile from "../models/profile.model.js";
// import prisma from "../config/prisma.js";

// export const register = async (req, res) => {
//   let newUser = null;
//   let newProfile = null;

//   try {
//     // const { username, email, password } = req.body;
//     const username = req.body.username.toLowerCase();
//     const email = req.body.email.toLowerCase();
//     const password = req.body.password;

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { email },
//           { username }
//         ]
//       }
//     });

//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: "Email already registered" });
//       }
//       if (existingUser.username === username) {
//         return res.status(400).json({ message: "Username already taken" });
//       }
//     }

//     const hashedPassword = await argon2.hash(password);

//     newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword
//       }
//     });

//     newProfile = new Profile({
//       userId: newUser.id.toString(),
//       username: newUser.username
//     });

//     await newProfile.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error(error);

//     if (newUser) {
//       await prisma.user.delete({ where: { id: newUser.id } }).catch((err) => {
//         console.error("Failed to rollback PostgreSQL:", err);
//       });
//     }

//     if (newProfile) {
//       await Profile.deleteOne({ _id: newProfile._id }).catch((err) => {
//         console.error("Failed to rollback MongoDB:", err);
//       });
//     }

//     res.status(500).json({ message: "Error during registration" });
//   }
// };

export const login = async (req, res) => {
  try {
    // const { email, password } = req.body;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

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
