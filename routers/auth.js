import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Joi from "joi";
import { OAuth2Client } from "google-auth-library";

dotenv.config(); // Load environment variables

const router = express.Router();
 

// Define Joi schema for validation
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

// Send response utility function
const sendResponse = (
  res,
  status,
  data = null,
  error = false,
  message = ""
) => {
  res.status(status).json({ data, error, message });
};

// User Registration API
router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: true, message: errorMessage });
  }

  const user = await User.findOne({ email: value.email });
  if (user)
    return sendResponse(
      res,
      403,
      null,
      true,
      "User email is already registered."
    );

  const hashedPassword = await bcrypt.hash(value.password, 12);
  value.password = hashedPassword;
  let newUser = new User({ ...value });
  newUser = await newUser.save();
  sendResponse(res, 201, newUser, false, "User registered successfully");
});

// User Login API
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);

  const user = await User.findOne({ email: value.email }).lean();
  if (!user)
    return sendResponse(res, 403, null, true, "User is not registered.");

  const isPasswordValid = await bcrypt.compare(value.password, user.password);
  if (!isPasswordValid)
    return sendResponse(res, 403, null, true, "Invalid Credentials.");

  const token = jwt.sign({ id: user._id }, process.env.AUTH_SECRET, {
    expiresIn: "100000d",
  });

  sendResponse(res, 200, { user, token }, false, "User logged in successfully");
});

// Google Login API
 

export default router;
