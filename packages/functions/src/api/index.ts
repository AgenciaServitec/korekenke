import express from "express";
import cors from "cors";
import { errorHandler, hostingToApi } from "./_middlewares";
import { body } from "express-validator";
import { patchUser, postUser, putUser } from "./users";
import { postCorrespondence } from "./correspondences";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(hostingToApi);

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

app.post("/user", postUser);
app.post("/correspondence", postCorrespondence);

app.put("/users/:userId", putUser);

app.patch("/users/:userId", [body("updateBy").exists()], patchUser);

app.use(errorHandler);

export { app };
