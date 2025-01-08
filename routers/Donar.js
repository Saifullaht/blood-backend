import express from "express";
import Donor from "../models/DonarsInfo.js";
import { AuthenticateAdmin, AuthenticateUser } from "../middleware/authentication.js";
const router = express.Router();

router.get("/" , AuthenticateUser, async (req, res) => {
      const DonarsInfo = await Donor.find();
      res.send(res , 200 , DonarsInfo , false , "Donars  fetch successfully");
})
router.post("/" ,  AuthenticateAdmin, async (req, res) => {  
    const donar = new Donor(req.body);
    donar = await donar.save();
      res.send(res , 201 , donar , false , "Donars added successfully");
})








export default router;
