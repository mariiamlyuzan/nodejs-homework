const { NotFound, BadRequest } = require("http-errors");
const shortid = require("shortid");
const { sendEmail } = require("../nodemailer/sendEmail");
const { User } = require("../models/user");

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return next(NotFound());
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verify success",
    });
  } catch (err) {
    next(err);
  }
}

async function repeatVerifyEmail(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return next(BadRequest("Missing required field email"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(NotFound());
    }
    if (!user.verify === false) {
      return next(BadRequest("Verification has already been passed"));
    }

    const verificationToken = shortid.generate();

    const mail = {
      to: email,

      subject: "Confirm email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`,
    };

    await sendEmail(mail);
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verify success",
    });
  } catch (err) {
    next(err);
  }
}
module.exports = { verifyEmail, repeatVerifyEmail };
