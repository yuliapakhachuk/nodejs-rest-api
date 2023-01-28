const express = require('express');
// const contacts = require("../../models/contacts")
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contactsController");
const addContactSchema = require("../../schemas/contacts");
const { validateBody } = require("../../middlewares");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contactsList = await getContacts();
    res.status(200).json(contactsList);
  } catch(error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  const contact = await getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  }
  res.json(contact)
})

router.post('/', validateBody(addContactSchema), async (req, res, next) => {
  const { body } = req;
  const newContact = await createContact(body);
  return res.status(201).json(newContact);
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  } else {
    await deleteContact(contactId);
    return next(res.status(200).json({ message: `Contact with id ${contactId} was successfully deleted` }));
  }
})

router.put('/:contactId', validateBody(addContactSchema), async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const contact = await getContactById(contactId);
  if(!contact){
    return res.status(404).json({
      message: `Contact with id ${contactId} not found`
    })
  } else {
    await updateContact(contactId, body);
    return next(res.status(200).json({ message: `Contact with id ${contactId} was successfully updated` }));
  }
})

router.patch(
  "/:contactId/favorite",
  validateBody(updateStatusSchema),
  updateStatusContact
);

module.exports = router

