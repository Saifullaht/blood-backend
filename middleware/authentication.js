import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function AuthenticateUser(req, res, next) {
    try {
        console.log("auth", req.headers.authorization);
        const bearerToken = req?.headers?.authorization;
        const token = bearerToken?.split(" ")[1];

        if (!token) {
            return res.status(500).json({ error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.Auth_Secret);

        if (decoded) {
            console.log("Decoded JWT:", decoded);  
            const user =  User.findById(decoded._id);
            if(!user) return res.status(403).json({ error: "User not found" })
            req.user = decoded;
            next();
        } else {
            return res.status(500).json({ error: "SomeThing Went Wrong" });
        }
    } catch (err) {
        console.error("Authentication error:", err); // Log error for debugging
        return res.status(500).json({ error: "SomeThing Went Wrong" });
    }
}
export function AuthenticateAdmin(req, res, next) {
    try {
        console.log("auth", req.headers.authorization);
        const bearerToken = req?.headers?.authorization;
        const token = bearerToken?.split(" ")[1];

        if (!token) {
            return res.status(500).json({ error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.Auth_Secret);

        if (decoded.role === "admin") {
        
            next();
        } else {
            return res.status(403).json({ error: "Only  Admin  allowed to access" });
             
        }
    } catch (err) {
        console.error("Authentication error:", err); // Log error for debugging
        next();
    }
}
