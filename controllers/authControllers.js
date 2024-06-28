import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import mail from "../mail/mail.js";
import crypto from "node:crypto";
import "dotenv/config";
import { registerUserSchema, loginUserSchema } from "../schemas/usersSchema.js";

export const register = async (req, res, next) => {
  const { error } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(HttpError(400, errorMessage));
  }
  try {
    const { email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (existedUser) throw HttpError(409, "Email in use");

    const hashPassword = await bcrypt.hash(password, 10);
    const generatedAvatar = gravatar.url(email);
    const verificationToken = crypto.randomUUID();

    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL: `http:${generatedAvatar}`,
      verificationToken,
    });

    const { subscription } = newUser;

    await mail.sendMail(email, verificationToken);

    res.status(201).json({
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { error } = loginUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(HttpError(400, errorMessage));
  }
  try {
    const { email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) throw HttpError(401, "Email or password is wrong");

    const isMatch = await bcrypt.compare(password, existedUser.password);
    if (!isMatch) throw HttpError(401, "Email or password is wrong");

    if (!existedUser.verify) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    const token = jwt.sign({ id: existedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    await User.findByIdAndUpdate(existedUser._id, { token });

    res.status(200).json({
      token,
      user: {
        email: existedUser.email,
        subscription: existedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const { id } = req.user;

    if (!["starter", "pro", "business"].includes(subscription)) {
      throw HttpError(400, "Invalid subscription type");
    }

    const result = await User.findByIdAndUpdate(
      id,
      { subscription },
      { new: true }
    );

    if (!result) throw HttpError(404, "User not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    console.log(user);
    console.log(verificationToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { verify: true, verificationToken: null }
    );

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user.verify)
      throw HttpError(400, "Verification has already been passed");

    console.log(user);

    await mail.sendMail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
