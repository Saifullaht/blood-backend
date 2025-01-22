import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";
import DonarsInfoRoutes from "./routers/Donar.js";

dotenv.config();

const PORT = 3008;
const app = express();

// CORS options for allowing specific origins
const corsOptions = {
  origin: "https://blood-donate-c5xr.vercel.app", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods (including OPTIONS for preflight)
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

// Apply CORS middleware
app.use(cors(corsOptions)); 

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions)); // Handle all OPTIONS requests

app.use(express.json());

console.log("MongoDB URI=>", process.env.MONGODBURI);

mongoose.connect(process.env.MONGODBURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.status(200).send("Server is running Saifullah");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/donarsinfo", DonarsInfoRoutes);

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
