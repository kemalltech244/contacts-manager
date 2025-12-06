import mongoose, { Schema } from "mongoose";

const usersDB = mongoose.createConnection(
  `${process.env.MONGO_URI}/users${process.env.MONGO_PORTION}`
);

const usersSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = usersDB.model("User", usersSchema);

export default User;
