import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  public_id: { type: String, required: true }, // Cloudinary identifier
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    dislikedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    content: { type: String, required: true },
    image: { type: imageSchema, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
