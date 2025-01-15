import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function AuthenticateUser(req, res, next) {
    try {
        console.log("auth", req.headers.authorization);
        const bearerToken = req?.headers?.authorization;
        const token = bearerToken?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.Auth_Secret);

        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const user = await User.findById(decoded._id); // Await for database call
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Authentication failed", details: err.message });
    }
}
export async function AuthenticateAdmin(req, res, next) {
    try {
        console.log("auth", req.headers.authorization);
        const bearerToken = req?.headers?.authorization;
        const token = bearerToken?.split(" ")[1];
        console.log("Token from Cookies:", Cookies.get("token"));


        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.Auth_Secret);

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Only admins are allowed" });
        }

        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Authentication failed", details: err.message });
    }
}