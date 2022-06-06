const express = require("express");

const router = express.Router();

const { register, logIn, logOut } = require("../../controllers/auth");

const { auth } = require("../../middlewares/auth");
const {
  userRegisterValidation,
  userLogInValidation,
} = require("../../middlewares/validation");

router.post("/register", userRegisterValidation, register);
router.post("/login", userLogInValidation, logIn);
router.get("/logout", auth, logOut);
module.exports = router;
