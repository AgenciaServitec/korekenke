import { Request, Response, NextFunction } from "express";

export const getAssistances = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.status(200).end();
};
