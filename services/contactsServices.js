import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}


async function listContacts() {
  return await readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  let contacts = await readContacts();
  const removedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (removedContactIndex !== -1) {
    const removedContact = contacts.splice(removedContactIndex, 1)[0];
    await writeContacts(contacts);
    return removedContact;
  }
  return null;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateContact(id, { name, email, phone }) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    const updatedContact = {
      ...contacts[index],
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      id,
    };
    contacts[index] = updatedContact;
    await writeContacts(contacts);
    return contacts[index];
  }
  return null;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
