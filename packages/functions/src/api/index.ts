import express from "express";
import cors from "cors";
import { errorHandler, hostingToApi } from "./_middlewares";
import { body } from "express-validator";
import { patchUser, postUser, putUser } from "./users";
import { postCorrespondence } from "./correspondences";
import { getEntityDataByDni } from "./entities";
import { getUserByCipInCmsts } from "./consult";
import { onResendMailNotificationDasRequest } from "./onResendMailNotificationDasRequest";
import { getIp } from "./consult/getIp";
import {
  postSendCode,
  postSendPassword,
  postVerificationCode,
} from "./sign-in";
import {
  getUsersWithFingerprintTemplate,
  putBiometricAssistanceByCip,
  putUserFingerprintTemplate,
} from "./fingerprint";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(hostingToApi);

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

app.post(
  "/user",
  [
    body("email").exists(),
    body("cip").exists(),
    body("dni").exists(),
    body("phone").exists(),
  ],
  postUser
);
app.put("/users/:cip/fingerprint", putUserFingerprintTemplate);
app.put("/fingerprint/assistances/:cip", putBiometricAssistanceByCip);
app.put("/users/:userId", putUser);
app.patch("/users/:userId", [body("updateBy").exists()], patchUser);

app.post("/correspondence", postCorrespondence);

app.get("/entities/dni/:dni", getEntityDataByDni);

app.get("/consult/cmsts/:cip", getUserByCipInCmsts);

app.post(
  "/emails/notification-das-request/:dasRequestId",
  onResendMailNotificationDasRequest
);

app.get("/get-api", getIp);

app.post("/verify-email/send-code", postSendCode);

app.post("/verify-email/send-password", postSendPassword);

app.post("/verify-email/verify-code", postVerificationCode);

app.get("/fingerprint/verify", getUsersWithFingerprintTemplate);

app.use(errorHandler);

export { app };
