const express = require("express");
const router = express.Router();
const { updateSubscription } = require("../../controllers/auth");
const { auth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");

const { getCurrentUser } = require("../../controllers/currentUser");
const { updateAvatar } = require("../../controllers/updateAvatar");
const { userSubscriptionValidation } = require("../../middlewares/validation");
router.get("/current", auth, getCurrentUser);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
router.patch("/:id", userSubscriptionValidation, updateSubscription);
module.exports = router;
