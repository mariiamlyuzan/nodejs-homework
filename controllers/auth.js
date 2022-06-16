const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const shortid = require("shortid");
const { SECRET_KEY } = process.env;
const { sendEmail } = require("../nodemailer/sendEmail");
const { User } = require("../models/user");

async function register(req, res, next) {
  try {
    const { password, email, subscription } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return next(Conflict(`User with ${email} exist`));
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const avatarUrl = gravatar.url(email);
    Jimp.read(avatarUrl)
      .then((image) => {
        return image.resize(250, 250);
      })
      .catch((err) => {
        console.error(err);
      });
    const verificationToken = shortid.generate();
    const user = await User.create({
      password: hashPassword,
      email,
      subscription,
      avatarUrl,
      verificationToken,
    });

    const mail = {
      to: email,
      subject: "Confirm email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    };

    await sendEmail(mail);

    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        email,
        subscription: user.subscription,
        avatarUrl,
        verificationToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function logIn(req, res, next) {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(Unauthorized(`Email ${email} not found`));
    }

    if (!user.verify) {
      return next(Unauthorized(`Not verify`));
    }

    const passwordCompare = bcrypt.compareSync(password, user.password);

    if (!passwordCompare) {
      return next(Unauthorized(`Password is wrong`));
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      status: "success",
      code: 200,
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function logOut(req, res, next) {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
}

async function updateSubscription(req, res, next) {
  const { id } = req.params;
  const { subscription } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { subscription },
      {
        new: true,
      }
    );
    if (!user) {
      return next(NotFound(404, `No contact with ${id} id`));
    }
    res.json({
      status: "success",
      code: 200,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(NotFound(404, `No contact with ${id} id`));
    }
    next(err);
  }
}
module.exports = {
  register,
  logIn,
  logOut,
  updateSubscription,
};
