const express = require('express');
const contacts = require("../../models/contacts")
const addContactSchema = require("../../schemas/contacts");
const { validateBody } = require("../../middlewares");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contactsList = await contacts.getContacts();
    res.status(200).json(contactsList);
  } catch(error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  const contact = await contacts.getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  }
  res.json(contact)
})

router.post('/', validateBody(addContactSchema), async (req, res, next) => {
  const { body } = req;
  const newContact = await contacts.addContact(body);
  return res.status(201).json(newContact);
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  } else {
    await contacts.removeContact(contactId);
    return next(res.status(200).json({ message: `Contact with id ${contactId} was successfully deleted` }));
  }
})

router.put('/:contactId', validateBody(addContactSchema), async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const contact = await contacts.getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  } else {
    await contacts.updateContact(contactId, body);
    return next(res.status(200).json({ message: `Contact with id ${contactId} was successfully updated` }));
  }
})

module.exports = router

