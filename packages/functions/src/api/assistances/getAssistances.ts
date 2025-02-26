import { Request, Response, NextFunction } from "express";
import { fetchAssistances } from "../../_firebase/collections";

export const getAssistances = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await fetchAssistances();

    res.status(200).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
