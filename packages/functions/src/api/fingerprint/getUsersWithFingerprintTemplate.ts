import { Request, Response } from "express";
import { fetchUsers } from "../../_firebase/collections";
import { isEmpty } from "lodash";

export const getUsersWithFingerprintTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await fetchUsers();

    const userWithFingerprintTemplate = users?.filter(
      (user) => !isEmpty(user?.fingerprintTemplate)
    );

    res.json({
      userWithFingerprintTemplate,
      message: "user_exists",
    });
  } catch (error) {
    console.error(error);
  }
};
