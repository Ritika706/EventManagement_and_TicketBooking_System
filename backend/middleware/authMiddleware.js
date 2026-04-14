import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  return next();
};
