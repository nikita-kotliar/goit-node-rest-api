import Joi from "joi";

export const validateFavoriteBody = Joi.object({
  favorite: Joi.boolean().required(),
});

export const updateContactSchemaValid = Joi.object({
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

export const createContactSchemaValid = Joi.object({
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