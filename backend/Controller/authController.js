import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Model/userSchema.js";

const getJwtSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

const toPublicUser = (userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
});

const signToken = (userDoc) => {
  return jwt.sign(
    { sub: String(userDoc._id), role: userDoc.role },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const safeRole = role === "admin" ? "admin" : "user";

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: safeRole,
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
