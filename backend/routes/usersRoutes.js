import { Router } from "express";

import {
  editUser,
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.post("/register", registerUser);

usersRouter.post("/login", loginUser);

usersRouter.get("/", getAllUsers);

usersRouter.put("/", editUser);

export default usersRouter;
