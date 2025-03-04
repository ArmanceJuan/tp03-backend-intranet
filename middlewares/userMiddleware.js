import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1].trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      maxAge: "7d",
    });

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: error.message });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res
        .status(401) // Verifier les code 400 pour voir lequel correspond
        .json({ message: "Unauthorized access, you are not admin" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};
