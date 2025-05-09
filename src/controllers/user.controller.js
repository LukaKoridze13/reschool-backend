import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { userSchema, loginSchema } from "../validations/user.validation.js";
import { generateRefreshToken, generateToken, verifyRefreshToken } from "../utils/token.utils.js";

export const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      })),
    });
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({
      errors: [
        {
          field: "email",
          message: "Email already exists",
        },
      ],
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      })),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            field: "email",
            message: "Incorrect email or password",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            field: "password",
            message: "Incorrect email or password",
          },
        ],
      });
    }

    const token = generateToken({ id: user._id });
    let refreshToken = null;
    let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if(req.body.rememberMe) {
      refreshToken = generateRefreshToken({ id: user._id }, ipAddress);
    }

    res.status(200).json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUser = async (req, res) => {
  res.status(200).json(req.user);
};

export const newAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const ipAddress = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

  try {
    const decoded = verifyRefreshToken(refreshToken, ipAddress);

    const newAccessToken = generateToken({ id: decoded.id });
    const newRefreshToken = generateRefreshToken({ id: decoded.id }, ipAddress);

    res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token", error: err.message });
  }
};