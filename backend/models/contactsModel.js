import mongoose, { Schema, model } from "mongoose";
import "dotenv/config";

const contactsDB = mongoose.createConnection(
  `${process.env.MONGO_URI}/contacts${process.env.MONGO_PORTION}`
);

const contactsSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = contactsDB.model("Contact", contactsSchema);
