import { NextFunction, Request, Response } from "express";
import { fetchAssistance } from "../../_firebase/collections";

interface Params {
  id: string;
}

export const getAssistance = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { id },
  } = req;

  try {
    await fetchAssistance(id);

    res.status(200).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
