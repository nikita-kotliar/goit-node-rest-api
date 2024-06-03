import mongoose from "mongoose";
import Contact from "../db/models/Contact.js";
import HttpError from "../helpers/HttpError.js";
import {
  updateContactSchema,
  updateStatusSchema,
  createContactSchema,
} from "../schemas/contactsSchemas.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const query = favorite
      ? { favorite: favorite === "true", owner: req.user.id }
      : { owner: req.user.id };

    const contacts = await Contact.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select("-owner"); 

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const contact = await Contact.findOne({ _id: id, owner: userId });

    if (!contact) throw HttpError(404, "Contact not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const contact = await Contact.findOneAndDelete({ _id: id, owner: userId });

    if (!contact) throw HttpError(404, "Contact not found or already deleted");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await Contact.create({ ...req.body, owner: id });
    const { error } = createContactSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(HttpError(400, errorMessage));
    }
    const resultObject = result.toObject();
    delete resultObject.owner;

    res.status(201).json(resultObject);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: userId },
      req.body,
      { new: true }
    );
    const { error } = updateContactSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(HttpError(400, errorMessage));
    }
    if (!result) throw HttpError(404, "Contact not found");

    if (result.owner.toString() !== req.user.id) throw HttpError(403);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const userId = req.user.id;

    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: userId },
      { favorite },
      { new: true }
    );
    const { error } = updateStatusSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!result) throw HttpError(404, "Contact not found");

    if (result.owner.toString() !== req.user.id) throw HttpError(403);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
