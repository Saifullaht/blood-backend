import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthenticateUser, AuthenticateAdmin } from "../middleware/authentication.js";
import User from "../models/User.js";

const router = express.Router();

 
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ success: true, message: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.Auth_Secret, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
});

// Update User Info
router.put("/", AuthenticateUser, async (req, res) => {
  try {
    const { city, country } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { city, country },
      { new: true }
    );

    res.status(200).json({ success: true, message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
});

// Admin-Only Route
router.get("/admin", AuthenticateAdmin, async (req, res) => {
  res.status(200).json({ success: true, message: "Welcome, Admin!" });
});

// Get User Info
router.get("/myinfo", AuthenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user info", error: err.message });
  }
});

export default router;
