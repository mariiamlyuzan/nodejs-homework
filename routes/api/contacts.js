const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
} = require("../../controllers/contacts");

const {
  contactValidation,
  contactFavoriteValidation,
} = require("../../middlewares/validation");

const { auth } = require("../../middlewares/auth");

router.get("/", auth, listContacts);

router.get("/:contactId", getContactById);

router.post("/", auth, contactValidation, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", contactValidation, updateContact);

router.patch("/:contactId/favorite", contactFavoriteValidation, updateFavorite);

module.exports = router;
