const express = require('express');

const {
    getContacts,
    updateContact,
    deleteContact,
    createContact,
    getContactById,
    updateStatusContact,
} = require("../../controllers/contactsController");

const {
  validateBody,
  addContactSchema,
  updateStatusSchema,
} = require("../../middlewares/index");

const router = express.Router()

router.get("/", getContacts);
router.get("/:contactId", getContactById);
router.post("/", createContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", validateBody(addContactSchema), updateContact);
router.patch(
  "/:contactId/favorite",
  validateBody(updateStatusSchema),
  updateStatusContact
);

module.exports = router;
