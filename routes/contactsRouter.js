import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import { checkAuth } from "../middlewares/checkAuth.js";
const contactsRouter = express.Router();

contactsRouter.get("/", checkAuth, getAllContacts);

contactsRouter.get("/:id", checkAuth, getOneContact);

contactsRouter.delete("/:id", checkAuth, deleteContact);

contactsRouter.post(
  "/",
  checkAuth,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  checkAuth,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  checkAuth,
  validateBody(updateStatusSchema),
  updateStatusContact
);

export default contactsRouter;
