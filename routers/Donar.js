import express from "express";
import Donor from "../models/DonarsInfo.js";
import {
  AuthenticateAdmin,
  AuthenticateUser,
} from "../middleware/authentication.js";
const router = express.Router();

router.get("/", AuthenticateUser, async (req, res) => {
  try {
    const donarsInfo = await Donor.find();
    return res.status(200).json({
      success: true,
      message: "Donors fetched successfully",
      data: donarsInfo,
    });
  } catch (err) {
    console.error("Error fetching donors:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donors",
      error: err.message,
    });
  }
});
router.post("/", AuthenticateUser, async (req, res) => {
  try {
    const donor = new Donor(req.body);
    const savedDonor = await donor.save();

    return res.status(201).json({
      success: true,
      message: "Donor added successfully",
      data: savedDonor,
    });
  } catch (err) {
    console.error("Error saving donor:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to add donor",
      error: err.message,
    });
  }
});

export default router;
