const { Contact } = require("../models/contact");
const shortid = require("shortid");
const createError = require("http-errors");

async function listContacts(req, res, next) {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    if (favorite) {
      const fav = await Contact.find({ owner: _id, favorite: favorite });
      res.json({ status: "success", code: 200, fav });
    }
    const contacts = await Contact.find({ owner: _id }, "", {
      skip,
      limit: Number(limit),
    });

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
    const { _id } = req.user;
    const { name, email, phone } = req.body;
    const contact = await Contact.create({
      id: shortid.generate(),
      name,
      email,
      phone,
      owner: _id,
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
