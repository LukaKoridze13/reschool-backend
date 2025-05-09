import jwt from "jsonwebtoken";

const SECRET = process.env.TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!SECRET || !REFRESH_SECRET) {
  throw new Error("TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined in .env");
}

// Access Token
export function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

// Refresh Token (IP-bound)
export function generateRefreshToken(payload, ipAddress, expiresIn = "7d") {
  const tokenPayload = { ...payload, ip: ipAddress };
  return jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn });
}

export function verifyRefreshToken(token, ipAddress) {
  const decoded = jwt.verify(token, REFRESH_SECRET);
  if (decoded.ip !== ipAddress) {
    throw new Error("Invalid IP address for refresh token");
  }
  return decoded;
}
