 const fs = require('fs/promises');
 const path = require("path");
 const { nanoid } = require("nanoid");
 const contactsPath = path.resolve(__dirname, "contacts.json");


const readContacts = async () => {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);

  return contacts;
};
const writeContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
}

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find((m) => m.id === contactId);
  return contact || null;
}

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const updateContactsDb = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await writeContacts(updateContactsDb);
}

const addContact = async (body) => {
  const {name, email, phone} = body;
  const id = nanoid();

  const contact = { id, name, email, phone };
  const contacts = await readContacts();
  contacts.push(contact);
  await writeContacts(contacts);
  return contact;
}

const updateContact = async (id, body) => {
  const contacts = await readContacts();

  const index = contacts.findIndex((item) => item.id === id.toString());
  if (index === -1) {
    return { message: "not found" };
  }
  contacts[index] = { id, ...body };
  await writeContacts(contacts);
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
