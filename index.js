// Import required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";
import DonarsInfoRoutes from "./routers/Donar.js";

// Load environment variables from .env file
dotenv.config();

// Define port number
const PORT = process.env.PORT || 3008;

// Create an Express application
const app = express();

// CORS configuration to allow requests from the frontend URL
app.use(
  cors({
    origin: "https://blood-donate-c5xr.vercel.app/",  
    credentials: true,  
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Log MongoDB URI for debugging
console.log("MongoDB URI =>", process.env.MONGODBURI);

// MongoDB connection
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => {
    console.log("MongoDB connected"); // If connected to MongoDB
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err); // Log MongoDB connection errors
  });

// Basic route for checking if the server is running
app.get("/", (req, res) => {
  res.status(200).send("Server is running Saifullah");
});

// Route handlers
app.use("/auth", authRoutes); // Authentication routes
app.use("/user", userRoutes); // User-related routes
app.use("/donarsinfo", DonarsInfoRoutes); // Blood donors information routes

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`); // Log server status
});
