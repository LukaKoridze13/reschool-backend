import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import mainRouter from "./routes/main.router.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5501", "http://localhost:5500", "http://localhost:3000"], // <-- Explicitly allow your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.set("trust proxy", true);
app.use("/api", mainRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5500, () => console.log("Server running on port 5500"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
