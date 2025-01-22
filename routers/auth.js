import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const router = express.Router();

// Joi Schemas
const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().alphanum().min(3).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).required(),
});

// Response Utility
const sendResponse = (res, status, data = null, error = false, message = "") => {
  res.status(status).json({ data, error, message });
};

// Register API
router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ error: true, message: errorMessage });
  }

  const user = await User.findOne({ email: value.email });
  if (user) return sendResponse(res, 403, null, true, "User already registered");

  const hashedPassword = await bcrypt.hash(value.password, 12);
  value.password = hashedPassword;
  let newUser = new User({ ...value });
  newUser = await newUser.save();
  sendResponse(res, 201, newUser, false, "User registered successfully");
});

// Login API
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return sendResponse(res, 400, null, true, errorMessage);
  }

  const user = await User.findOne({ email: value.email }).lean();
  if (!user) return sendResponse(res, 403, null, true, "User not found");

  const isPasswordValid = await bcrypt.compare(value.password, user.password);
  if (!isPasswordValid)
    return sendResponse(res, 403, null, true, "Invalid Credentials");

  const token = jwt.sign({ id: user._id }, process.env.Auth_Secret, {
    expiresIn: "365d", // 365 days
  });
  sendResponse(res, 200, { user, token }, false, "Login successful");
});

export default router;
