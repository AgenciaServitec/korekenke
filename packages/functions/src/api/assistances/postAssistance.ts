import { defaultFirestoreProps } from "../../utils";
import { firestore } from "../../_firebase";
import { Request, Response, NextFunction } from "express";

export const postAssistance = async (
  req: Request<unknown, unknown, Assistance, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: assistance } = req;

  try {
    await addAssistance(assistance);

    res.status(200).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const addAssistance = async (assistance: Assistance) => {
  const { assignCreateProps } = defaultFirestoreProps();

  await firestore
    .collection("assistances")
    .doc()
    .set(assignCreateProps(assistance));
};
