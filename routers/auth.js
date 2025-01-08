import express from "express"; // No need to import 'Router' separately since you're not using it explicitly
import User from "../models/User.js"; // 'User' is imported but not used in this code; it can be removed if  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Joi from "joi";

const router = express.Router(); // Correct way to create a router instance

// Define Joi schema for validation
const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(), // Make email required
  password: Joi.string().min(6).required(), // Password should be required
  fullname: Joi.string().alphanum().min(3).max(30).required(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(), // Make email required
  password: Joi.string().min(6).required() // Password should be required
   
});

// Send response utility function (optional, you can remove it if not needed)
const sendResponse = (
  res,
  status,
  data = null,
  error = false,
  message = ""
) => {
  res.status(status).json({ data, error, message });
};

router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  console.log("error=>", error);

  if (error) {
    // Joi validation errors are in the 'details' array, so we need to map them
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: true, message: errorMessage }); // Send error message
  }

  const user = await User.findOne({ email: value.email });
  if (user)
    return sendResponse(
      res,
      403,
      null,
      true,
      "User email Allready  in the registerd....."
    );
    const Hashedpasswords = await  bcrypt.hash(value.password , 12);
    console.log("hashedpasswords: " , Hashedpasswords);
    value.password = Hashedpasswords
    let newUser = new User({...value});
    newUser = await newUser.save();
    sendResponse(res, 201, newUser, false , "User registered successfully");
    
  
});
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  console.log("error=>", error);

  if (error) {
    // Joi validation errors are in the 'details' array, so we need to map them
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: true, message: errorMessage }); // Send error message
  }

  const user = await User.findOne({ email: value.email }).lean();
  if (!user)
    return sendResponse(
      res,
      403,
      null,
      true,
      "User is not authenticated "
    );
    const ispasswordvalid = await  bcrypt.compare(value.password , user.password);
    if(!ispasswordvalid) return sendResponse(res, 403,  null,  true , " Invalid Credentials.");
     
    var token = jwt.sign( user, process.env.Auth_Secret);
    sendResponse(res, 200, user , token, true , "User login successfully");
    
  
});

 

export default router;
