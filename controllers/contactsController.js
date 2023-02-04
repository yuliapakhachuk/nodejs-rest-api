const { Contact } = require("../models/contacts");

const getContacts = async (req, res, next) => {
  const contactsList = await Contact.find({});
  res.status(200).json(contactsList);
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;

  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    if (!contact) {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res, next) => {
  const body = req.body;
  const newContact = await Contact.create(body);
  return res.status(201).json(newContact);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!Object.prototype.hasOwnProperty.call(body, "favorite")) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(contact);
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};

