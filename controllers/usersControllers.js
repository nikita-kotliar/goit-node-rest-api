import HttpError from "../helpers/HttpError.js";
import User from "../db/models/User.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File not provided");
    }

    const { path: tempPath, filename } = req.file;
    const tempFilePath = path.resolve(tempPath);
    const outputDir = path.resolve("public/avatars");
    const outputFilePath = path.join(outputDir, filename);

    const image = await Jimp.read(tempFilePath);
    await image.resize(250, 250).writeAsync(tempFilePath);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.rename(tempFilePath, outputFilePath);

    const avatarURL = `/avatars/${filename}`;
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    res.status(200).json({ avatarURL: result.avatarURL });
  } catch (error) {
    next(error);
  }
};
