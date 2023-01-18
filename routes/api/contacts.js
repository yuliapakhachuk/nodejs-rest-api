const express = require('express');
const { nanoid } = require('nanoid');
const contacts = require("../../models/contacts")
// const addContactSchema = require("../../schemas/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contactsList = await contacts.listContacts();
  res.status(200).json(contactsList);
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

router.post('/', async (req, res, next) => {
  const { body } = req;
  const isValid = (body) => {
    return !Object.keys(body).some(e => e === false);
  }
  const isEmpty = (body) => {
    return !Object.values(body).some(e => e === false);
  }

  if (!isValid(body) && !isEmpty(body)) {
    res.status(400).json({error: "missing required name field"})
  } else {
    body.id = nanoid();
    const newContact = await contacts.addContact(body);
    return res.status(201).json(newContact);
  }
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

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const contact = await contacts.getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  } else {
    await contacts.updateContact(contactId, body);
    return next(res.status(200).json({ message: `Contact with id ${contactId} was successfully deleted` }));
  }
})

module.exports = router

