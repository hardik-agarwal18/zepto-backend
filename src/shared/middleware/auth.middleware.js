import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import { ApiError, ERROR_CODES } from "../errors/index.js";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        401,
        "Authentication required",
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 4️⃣ Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // Token expired or invalid
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired", ERROR_CODES.UNAUTHORIZED));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token", ERROR_CODES.UNAUTHORIZED));
    }

    next(err);
  }
}
