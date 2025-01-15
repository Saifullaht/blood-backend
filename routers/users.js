import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticateUser } from "../middleware/authentication.js";
import User from "../models/User.js";

const router = express.Router();

router.put("/", AuthenticateUser, async (req, res) => {
  try {
    const { city, country } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },  
      { city, country },
      { new: true }
    ).exec(true);

    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Token not provided" });
  }
  myinfo
});
router.get("/myinfo", AuthenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Tokon not provided" });
  }
});

export default router;
