import { NextFunction, Request, Response } from "express";
import { updateAssistance } from "../../_firebase/collections";
import { defaultFirestoreProps } from "../../utils";

export const putAssistance = async (
  req: Request<unknown, unknown, Assistance, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: assistance } = req;

  const { assignUpdateProps } = defaultFirestoreProps();

  try {
    await updateAssistance(assistance.id, assignUpdateProps(assistance));

    res.status(200).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
