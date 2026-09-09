import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.medikiosk_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.medikiosk_token;

  if (token) {
    try {
      req.auth = verifyToken(token);
    } catch {
      // Ignore invalid or expired token for optional authentication
    }
  }
  next();
}

