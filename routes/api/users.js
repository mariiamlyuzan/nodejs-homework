const express = require("express");
const router = express.Router();
const { updateSubscription } = require("../../controllers/auth");
const { auth } = require("../../middlewares/auth");

const { getCurrentUser } = require("../../controllers/currentUser");
const { userSubscriptionValidation } = require("../../middlewares/validation");
router.get("/current", auth, getCurrentUser);
router.patch("/:id", userSubscriptionValidation, updateSubscription);
module.exports = router;
