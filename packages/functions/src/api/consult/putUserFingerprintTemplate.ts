import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore } from "../../_firebase";
import { isEmpty } from "lodash";
import { fetchUser } from "../../_firebase/collections";

export const putUserFingerprintTemplate = async (
  req: Request<User, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    // body: { cip },
  } = req;

  console.log("「Get user data by CIP Initialize", cip, {
    params: req.params,
  });

  try {
    const userInCmsts = await fetchUser(cip);

    if (isEmpty(userInCmsts))
      res.status(404).json({ message: "user_not_found_in_cmsts" });

    // const user = await fetchUserByCip(userInCmsts[0]?.userCip);

    const { firstName, paternalSurname, maternalSurname } = await user[0];

    res.json({
      firstName,
      paternalSurname,
      maternalSurname,
      message: "user_registered_in_cmsts",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
