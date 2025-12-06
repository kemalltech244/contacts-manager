import { compare, hash } from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const hashedPassword = await hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User registered successfully! Proceed to login" });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      res.status(400).json({
        message: `User with ${email} already exist! Proceed to login/reset password`,
      });
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully! Redirecting...",
      token: accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credantials!" });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ message: "All users are here", users });
};

export const editUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    const hashedPassword = await hash(password, 10);
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    res.status(200).json({ message: "Password successfully reset!" });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
