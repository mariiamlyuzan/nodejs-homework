const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
} = require("../../models/contacts.js");

const {
  contactValidation,
  contactFavoriteValidation,
} = require("../../middlewares/validation");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", contactValidation, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", contactValidation, updateContact);

router.patch("/:contactId/favorite", contactFavoriteValidation, updateFavorite);

module.exports = router;
