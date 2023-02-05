const express = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contactsController");
const {
  validateBody,
  addContactSchema,
  updateStatusSchema,
} = require("../../middlewares");

const router = express.Router();

router.get("/", getContacts);
router.get("/:contactId", getContactById);
router.post("/", createContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", validateBody(addContactSchema), updateContact);
router.patch("/:contactId/favorite",
  validateBody(updateStatusSchema),
  updateStatusContact
);

module.exports = router;