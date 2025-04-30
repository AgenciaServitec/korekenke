import { Request, Response } from "express";
import { defaultFirestoreProps } from "../../utils";
import { firestoreTimestamp } from "../../_firebase";
import moment from "moment-timezone";
import {
  assistancesRef,
  fetchUserByCip,
  getAssistanceId,
  fetchTodayAssistancesByUserId,
  updateAssistance,
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
    const user = users?.[0];

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const nowTimestamp = firestoreTimestamp.now();
    const nowFormatted = moment(nowTimestamp.toDate())
      .tz("America/Lima")
      .format("DD-MM-YYYY HH:mm");

    const todayAssistances = await fetchTodayAssistancesByUserId(user.id);
    const existingAssistance = todayAssistances?.[0];

    let assistanceResult;

    if (existingAssistance) {
      assistanceResult = {
        ...existingAssistance,
        outlet: { date: nowFormatted },
      };

      await updateAssistance(existingAssistance.id, {
        outlet: { date: nowFormatted },
      });
    } else {
      const assistanceData = assignCreateProps({
        userId: user.id,
        id: getAssistanceId(),
        createAtString: nowFormatted,
        entry: { date: nowFormatted, dateTimestamp: nowTimestamp },
        outlet: null,
        user: user,
        workPlace: user.workPlace || null,
      });

      await assistancesRef.doc(assistanceData.id).set(assistanceData);
      assistanceResult = assistanceData;
    }

    res.json(assistanceResult);
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
