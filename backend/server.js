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
import homeRoutes from "./routes/home.route.js";
import aiServiceRoutes from "./routes/ai_service.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import socketAuthMiddleware from "./middlewares/socketAuth.middleware.js";
import socketRoutes from "./routes/socket.route.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();
connectMongoDB();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://13.232.20.120",
  "http://clownapp.fun",
  "http://www.clownapp.fun",
  "https://clownapp.fun",
  "https://www.clownapp.fun",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

// HTTP Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/post", postRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/ai-service", aiServiceRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', async (req, res) => {
  res.send('server is running');
});

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// WebSocket authentication middleware
io.use(socketAuthMiddleware);

// Attach Socket.IO routes
socketRoutes(io);

const PORT = process.env.PORT || 5000;

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});