import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  updateSubscription,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  subscriptionUserSchema,
} from "../schemas/usersSchema.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/logout", checkAuth, logout);
authRouter.get("/current", checkAuth, currentUser);
authRouter.patch(
  "/subscription",
  checkAuth,
  validateBody(subscriptionUserSchema),
  updateSubscription
);

export default authRouter;
