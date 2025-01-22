import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function AuthenticateUser(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
}

export async function AuthenticateAdmin(req, res, next) {
  try {
    await AuthenticateUser(req, res, async () => {
      const user = req.user;
      if (user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admins only" });
      }
      next();
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Admin authentication failed" });
  }
}
