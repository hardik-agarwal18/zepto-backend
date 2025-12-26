import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

export function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: user.id }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}
