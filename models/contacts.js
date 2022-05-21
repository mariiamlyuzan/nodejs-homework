const path = require("path");
const fs = require("fs").promises;
const contactsPath = path.resolve("models/contacts.json");
const shortid = require("shortid");

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function listContacts(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    return res.json({ status: "success", code: 200, contacts });
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contacts = await getContacts();

    const contact = contacts.find(
      (contact) => contact.id === contactId.toString()
    );
    console.log(contact);
    if (!contact) {
      const error = new Error(`No contact with ${contactId} id`);
      error.status = 404;
      throw error;
    }

    return res.json({ status: "success", code: 200, contact });
  } catch (error) {
    next(error);
  }
}

async function removeContact(req, res, next) {
  try {
    const contacts = await getContacts();
    const { contactId } = req.params;

    const newContacts = contacts.filter(
      (contact) => contact.id !== contactId.toString()
    );
    const contact = contacts.find(
      (contact) => contact.id === contactId.toString()
    );

    if (!contact) {
      const error = new Error(`No contact with ${contactId} id`);
      error.status = 404;
      throw error;
    }
    await fs.writeFile(
      "models/contacts.json",
      JSON.stringify(newContacts),
      "utf8"
    );

    return res.json({
      status: "success",
      code: 200,
      mesasage: "contact deleted",
      contact,
    });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const contacts = await getContacts();

    const { name, email, phone } = req.body;

    contacts.push({ id: shortid.generate(), name, email, phone });

    await fs.writeFile(
      "models/contacts.json",
      JSON.stringify(contacts),
      "utf8"
    );

    res.status(201).json({ status: "success", code: 201, contacts });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;

    const contacts = await getContacts();

    const { contactId } = req.params;

    const contact = contacts.find(
      (contact) => contact.id === contactId.toString()
    );

    if (!contact) {
      const error = new Error(`No contact with ${contactId} id`);
      error.status = 404;
      throw error;
    }
    contacts.forEach((contact) => {
      if (contact.id === contactId.toString()) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
      }
    });
    await fs.writeFile(
      "models/contacts.json",
      JSON.stringify(contacts),
      "utf8"
    );
    res.json({ status: "success", code: 200, contacts });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
