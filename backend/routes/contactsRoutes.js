import { Router } from "express";
import {
  deleteOneContact,
  getAllContacts,
  getOneContact,
  postOneContact,
  updateOneContact,
} from "../controllers/contactsController.js";
import { validateToken } from "../middleware/validateToken.js";

const contactsRouter = Router();

contactsRouter.use(validateToken);

contactsRouter.get("/", getAllContacts);
contactsRouter.post("/", postOneContact);

contactsRouter
  .route("/:id")
  .get(getOneContact)
  .put(updateOneContact)
  .delete(deleteOneContact);

export default contactsRouter;
