const { User } = require("../models/user");
const { Unauthorized } = require("http-errors");
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    const { authorization = "" } = req.headers;

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      return next(Unauthorized("Not authorized"));
    }

    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(Unauthorized("Not authorized"));
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.message === "Invalid signature") {
      return next(Unauthorized(401));
    }
    next(err);
  }
}

module.exports = { auth };
