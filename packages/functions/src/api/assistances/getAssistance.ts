import { Request, Response, NextFunction } from "express";

export const getAssistance = async (
  req: Request<Assistance, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.status(200).end();
};
