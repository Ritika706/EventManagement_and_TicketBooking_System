import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../Model/userSchema.js";
import { isEmailConfigured, sendPasswordResetEmail } from "../utils/mailer.js";

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

    const outUser = toPublicUser(user);
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: outUser,
      data: { token, user: outUser },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error" });
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
      return res.status(404).json({ message: "Email not found" });
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      return res.status(401).json({ message: "Wrong password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    const token = signToken(user);

    const outUser = toPublicUser(user);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: outUser,
      data: { token, user: outUser },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body || {};

    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: "email is required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: "Access denied for this role" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetTokenHash = resetHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const getFrontendBaseUrl = () => {
      const envUrl = process.env.FRONTEND_URL || process.env.APP_URL;
      if (typeof envUrl === "string" && /^https?:\/\//i.test(envUrl.trim())) {
        return envUrl.trim().replace(/\/+$/, "");
      }

      const origin = req.get("origin");
      if (typeof origin === "string") {
        const cleaned = origin.trim();
        if (cleaned && cleaned.toLowerCase() !== "null" && /^https?:\/\//i.test(cleaned)) {
          return cleaned.replace(/\/+$/, "");
        }
      }

      return "http://localhost:3000";
    };

    const appUrl = getFrontendBaseUrl();
    const roleParam = role === "admin" ? "admin" : "user";
    // Keep the clickable link free of token/role/email so it looks safe and works on mobile.
    // Email should *display* a clean URL, but the actual click needs a one-time secret.
    const resetUrlDisplay = `${appUrl}/reset-password`;
    const resetUrl = `${appUrl}/reset-password/${encodeURIComponent(resetToken)}`;

    const response = {
      message: "Password reset link sent successfully.",
    };

    if (isEmailConfigured()) {
      await sendPasswordResetEmail({
        to: normalizedEmail,
        name: user.name,
        resetUrl,
        resetUrlDisplay,
        role: roleParam,
      });
    } else if (process.env.NODE_ENV !== "production") {
      // Dev fallback: show the reset URL if SMTP isn't configured.
      response.resetUrl = resetUrl;
      response.resetUrlDisplay = resetUrlDisplay;
    }

    return res.status(200).json({ success: true, ...response, data: { message: response.message } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, role } = req.body || {};

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "token and newPassword are required" });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({ passwordResetTokenHash: tokenHash }).select(
      "+passwordResetTokenHash +passwordResetExpires +password"
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    if (!user.passwordResetExpires || user.passwordResetExpires <= new Date()) {
      return res.status(400).json({ success: false, message: "Reset token expired" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: "Access denied for this role" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(newPassword), salt);

    user.password = hashedPassword;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: { message: "Password reset successful", role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
