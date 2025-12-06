import express from "express";
import cors from "cors";
import "dotenv/config";
import contactsRouter from "./routes/contactsRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server on at ${PORT}`);
});
