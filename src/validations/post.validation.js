import Joi from "joi";

export const postSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be at most 100 characters",
    "any.required": "Title is required",
  }),

  content: Joi.string().min(10).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters",
    "any.required": "Content is required",
  }),

});
