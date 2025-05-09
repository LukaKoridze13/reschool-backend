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
    content: { type: String, required: true },
    image: { type: imageSchema, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
