const { User } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function updateAvatar(req, res, next) {
  const { path: tempDir, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const img = await Jimp.read(tempDir);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempDir);
    const avatarUrl = path.join("public", "avatars", imageName);

    const settledDir = path.join(avatarsDir, imageName);

    await fs.rename(tempDir, settledDir);
    await User.findByIdAndUpdate(req.user._id, { avatarUrl });
    res.json({ avatarUrl });
  } catch (error) {
    await fs.unlink(tempDir);
    next(error);
  }
}

module.exports = { updateAvatar };
