const express = require("express");
const router = express.Router();
const { updateSubscription } = require("../../controllers/auth");
const { auth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");
const {
  verifyEmail,
  repeatVerifyEmail,
} = require("../../controllers/verifyEmail");
const { getCurrentUser } = require("../../controllers/currentUser");
const { updateAvatar } = require("../../controllers/updateAvatar");
const { userSubscriptionValidation } = require("../../middlewares/validation");
router.get("/current", auth, getCurrentUser);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
router.post("/verify", repeatVerifyEmail);
router.get("/verify/:verificationToken", verifyEmail);
router.patch("/:id", userSubscriptionValidation, updateSubscription);
module.exports = router;
