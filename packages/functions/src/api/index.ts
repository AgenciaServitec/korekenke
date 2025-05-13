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
import Busboy from "busboy";
import XLSX from "xlsx";
import { Readable } from "stream";

const app: express.Application = express();

app.use(cors({ origin: "*" }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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

app.post("/upload", (req: Request, res: Response) => {
  const busboy = Busboy({ headers: req.headers });

  const fileBuffer: Buffer[] = [];
  let fileFound = false;

  busboy.on(
    "file",
    (
      fieldname: string,
      file: Readable,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      console.log("Archivo recibido:", fieldname);
      console.log("Archivo recibido:", filename);
      console.log("Archivo recibido:", encoding);
      console.log("Archivo recibido:", mimetype);

      fileFound = true;

      file.on("data", (data: Buffer) => {
        fileBuffer.push(data);
      });

      file.on("end", () => {
        const fullBuffer = Buffer.concat(fileBuffer);
        try {
          const workbook = XLSX.read(fullBuffer, { type: "buffer" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet);

          res.status(200).json({ message: "Archivo procesado", data });
        } catch (err) {
          console.error("Error procesando el archivo:", err);
          res.status(500).json({ error: "Error procesando el archivo" });
        }
      });
    }
  );

  busboy.on("finish", () => {
    if (!fileFound) {
      res.status(400).json({ message: "No se envió ningún archivo" });
    }
  });

  req.pipe(busboy);
});

app.use(errorHandler);

export { app };
