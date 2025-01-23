import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust model path

export async function AuthenticateUser(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET); // Verify token with secret
    const user = await User.findById(decoded.id); // Find user by ID in the database

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ success: false, message: "Authentication failed", error: err.message });
  }
}

export async function AuthenticateAdmin(req, res, next) {
  try {
    await AuthenticateUser(req, res, async () => {
      const user = req.user; // Extract user from the request object
      if (user.role !== "admin") { // Check if the user has an "admin" role
        return res.status(403).json({ success: false, message: "Admins only" });
      }
      next(); // Proceed to next middleware or route handler
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Admin authentication failed", error: err.message });
  }
}
