import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils";
import { fetchUsers } from "../../_firebase/collections";

export const getUserByFingerprintTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await fetchUsers();

    logger.log("users: ", users);

    const userWithFingerprintTemplate = users?.filter(
      (user) =>
        user.fingerprintTemplate && {
          cip: user.cip,
          firstName: user.firstName,
          paternalSurname: user.paternalSurname,
          maternalSurname: user.maternalSurname,
          fingerprintTemplate: user.fingerprintTemplate,
        }
    );

    logger.log("userWithFingerprintTemplate: ", userWithFingerprintTemplate);

    res.json({
      userWithFingerprintTemplate,
      message: "user_exists",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
