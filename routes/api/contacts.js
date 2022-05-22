const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

const { contactValidation } = require("../../middlewares/validation");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", contactValidation, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", contactValidation, updateContact);

module.exports = router;
