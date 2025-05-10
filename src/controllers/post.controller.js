import Post from "../models/post.model.js";
import { postSchema } from "../validations/post.validation.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

export const postFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;

    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "firstName lastName");

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalPosts,
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createPost = async (req, res) => {
  const { title, content } = req.body;

  const { error } = postSchema.validate({ title, content }, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      })),
    });
  }

  try {
    let image = null;

    if (req.file && req.file.buffer) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    const post = await Post.create({
      title,
      content,
      image,
      user: req.user._id,
    });

    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
