import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import "dotenv/config";
import "./db/dbServer.js";
import path from "node:path";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

const app = express();

const UPLOAD_DIR = path.resolve("uploads");

app.use("/uploads", express.static(UPLOAD_DIR));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);
app.use("/api-docs", swaggerDocs()); 

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
