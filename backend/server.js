import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import searchRoutes from "./routes/search.route.js";
import connectionRoutes from "./routes/connection.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();
connectMongoDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());


// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/post", postRoutes);

app.get('/', async (req, res) => {
    res.send('server is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));