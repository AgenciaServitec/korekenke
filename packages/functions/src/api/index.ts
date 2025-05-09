import express, { Request, Response } from "express";
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
import XLSX from "xlsx";
import multer from "multer";
import { logger } from "../utils";

const app: express.Application = express();

app.use(cors({ origin: "*" }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No se envió ningún archivo" });
    return;
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<ParticipanteExcel>(sheet);

    // Ejemplo de mapeo de datos con campos como CIP y DNI
    const participantes = data.map((row) => ({
      nombre: row.nombre || "",
      numero: row.numero || "",
      grupo: row.grupo || "",
      cip: String(row.cip || ""),
      dni: String(row.dni || ""),
    }));

    logger.log("Participantes:", participantes);

    // Aquí puedes guardar en Firestore si ya está configurado

    res.status(200).json({ message: "Archivo procesado", data: participantes });
  } catch (error) {
    logger.error("Error al procesar el Excel:", error);
    res.status(500).json({ message: "Error al procesar el archivo" });
  }
});

app.use(errorHandler);

export { app };
