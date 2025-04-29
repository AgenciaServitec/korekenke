import { Request, Response } from "express";
import { defaultFirestoreProps } from "../../utils";
import { firestoreTimestamp } from "../../_firebase";
import moment from "moment";
import {
  assistancesRef,
  fetchUserByCip,
  getAssistanceId,
} from "../../_firebase/collections";

interface Params {
  cip: string;
}

const { assignCreateProps } = defaultFirestoreProps();

export const putBiometricAssistanceByCip = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response
): Promise<void> => {
  const { cip } = req.params;

  try {
    const users = await fetchUserByCip(cip);

    if (!users?.length) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const user = users[0];

    const now = moment.tz(
      moment(firestoreTimestamp.now()).format("DD-MM-YYYY h:mm a"),
      "America/Lima"
    );

    const assistanceData = {
      userId: user.id,
      id: getAssistanceId(),
      createAtString: now,
      entry: {
        date: now,
      },
      outlet: null,
      user: user,
      workPlace: user.workPlace || null,
    };

    await assistancesRef
      .doc(assistanceData.id)
      .set(assignCreateProps(assistanceData));

    res.json(cip);
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
