import Joi from "joi";

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be empty",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be empty",
  }),
  phone: Joi.string().messages({
    "string.empty": "Phone number cannot be empty",
  }),
});
