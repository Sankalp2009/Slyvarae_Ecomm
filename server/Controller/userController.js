import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../Model/userModel.js";
import { createSendToken, verifyToken } from "../Utils/jwt.js";

dotenv.config({ path: "./config.env" });

const SUPER_ADMIN = {
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD,
  name: process.env.SUPER_ADMIN_NAME,
};

export const Register = async (req, res) => {
  try {
    const { name = "", email = "", password = "", photo = "" } = req.body;

    // 1️⃣ Validate fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: name, email, and password.",
      });
    }

    // 2️⃣ Prevent admin email registration
    if (email.toLowerCase() === SUPER_ADMIN?.email.toLowerCase()) {
      return res.status(400).json({
        status: "fail",
        message: "This email is reserved. Please use a different email.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3️⃣ Check existing user (use `.lean()` for faster read)
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists with this email.",
      });
    }

    // 5️⃣ Create user (ignore role from client)
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      photo: photo || "",
      role: "user",
    });

    // 6️⃣ Generate token
    return createSendToken(newUser, 201, res, "User registered successfully.");
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already registered.",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation failed.",
        errors,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error during registration.",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const plainPassword = password.trim();

    // Step 2: Fetch user with password
    // Using .lean() for faster read since we don’t need mongoose doc methods
    const user = await User.findOne({ email: normalizedEmail })
      .select("+password")
      .lean(); // returns plain JS object, lighter & faster

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    // Step 3: Compare password securely
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    // Step 4: Clean output
    delete user.password; // safely remove password before sending

    // Step 5: Send token response
    return createSendToken(user, 200, res, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during login.",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    let token;

    // Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists (use lean for performance)
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    // Generate new token automatically
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};
