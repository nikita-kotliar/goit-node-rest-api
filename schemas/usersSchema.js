import Joi from "joi";

export const registerUserSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().trim().lowercase().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be empty",
  }),
});

export const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().trim().lowercase().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be empty",
  }),
});

const validSubscriptions = ["starter", "pro", "business"];

export const subscriptionUserSchema = Joi.object({
  subscription: Joi.string()
    .valid(...validSubscriptions)
    .required(),
});
