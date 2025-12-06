import { Contact } from "../models/contactsModel.js";

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user._id });
  res.status(200).json({
    message: `These are the contacts saved by ${req.user.email}:`,
    contacts,
  });
};

export const postOneContact = async (req, res) => {
  const { name, contact } = req.body;
  try {
    if (!name || !contact) {
      return res
        .status(400)
        .json({ message: "Both name and contact are required!" });
    }
    await Contact.create({ user_id: req.user._id, name, contact });
    return res.status(200).json({ message: "CONTACT SAVED" });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      return res.status(400).json({ message: "Phone Number already saved!" });
    }
  }
};

export const getOneContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact.user_id.toString() !== req.user._id) {
    return res
      .status(400)
      .json({ message: "You are not allowed to find another users contact!" });
  }

  res
    .status(200)
    .json({ message: "ONE CONTACT FOUND!", user: req.user, contact });
};

export const updateOneContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact.user_id.toString() !== req.user._id) {
    return res.status(400).json({
      message: "You are not allowed to update another users contact!",
    });
  }
  await Contact.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ message: "ONE CONTACT UPDATED!" });
};

export const deleteOneContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact.user_id.toString() !== req.user._id) {
    return res
      .status(200)
      .json({ message: "You are not allowed to delete other users contact!" });
  }
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "ONE CONTACT DELETED!" });
};
