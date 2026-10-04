// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path if needed

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    // Check if the decoded token has the expected structure
    if (!decoded._id && !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token structure" });
    }
    // Normalize the user object to always have _id
    req.user = {
      _id: decoded._id || decoded.id,
      role: decoded.role || 'user'
    };
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
