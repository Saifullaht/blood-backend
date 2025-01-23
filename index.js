import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  // Import cors
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";
import DonarsInfoRoutes from "./routers/Donar.js";

dotenv.config();  // Load environment variables from .env file

const PORT = 3008;  // Define port number
const app = express();  // Create an Express application

// CORS configuration to allow requests from the frontend URL
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests

console.log("MongoDB URI=>", process.env.MONGODBURI);  // Log MongoDB URI for checking

// MongoDB connection
mongoose.connect(process.env.MONGODBURI)
  .then(() => {
    console.log("MongoDB connected");  // If connected to MongoDB
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);  // If there's an error in connecting
  });

// Basic route for checking if the server is running
app.get("/", (req, res) => {
  res.status(200).send("Server is running Saifullah");
});

// Route handlers
app.use("/auth", authRoutes);  // Authentication routes
app.use("/user", userRoutes);  // User-related routes
app.use("/donarsinfo", DonarsInfoRoutes);  // Blood donors information routes

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);  // Log server status
});
