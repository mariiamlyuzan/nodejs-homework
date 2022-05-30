const { Contact } = require("./contact");
const shortid = require("shortid");
const createError = require("http-errors");

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find({});
    res.json({ status: "success", code: 200, contacts });
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    return res.json({ status: "success", code: 200, contact });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    next(err);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    if (!contact) {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    res.json({
      status: "success",
      code: 200,
      mesasage: "contact deleted",
      contact,
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const contact = await Contact.create({
      id: shortid.generate(),
      name,
      email,
      phone,
    });

    res.status(201).json({ status: "success", code: 201, contact });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!contact) {
      return next(createError(404, `No contact with ${contactId} id`));
    }

    res.json({ status: "success", code: 200, contact });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    next(err);
  }
}

async function updateFavorite(req, res, next) {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
    );
    if (!contact) {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    res.json({ status: "success", code: 200, contact });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(createError(404, `No contact with ${contactId} id`));
    }
    next(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
};
