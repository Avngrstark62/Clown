import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"

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

app.get('/', async (req, res) => {
    res.send('server is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
