import express from "express";
import Donor from "../models/DonarsInfo.js";
import { AuthenticateUser } from "../middleware/authentication.js";

const router = express.Router();

// Get Donors
router.get("/", AuthenticateUser, async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({ success: true, data: donors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch donors" });
  }
});

// Add Donor
router.post("/", AuthenticateUser, async (req, res) => {
  try {
    const donor = new Donor(req.body);
    const savedDonor = await donor.save();
    res.status(201).json({ success: true, data: savedDonor });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add donor" });
  }
});



export default router;

