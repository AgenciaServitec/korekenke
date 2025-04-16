import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore } from "../../_firebase";
import { isEmpty } from "lodash";

interface Params {
  cip: string;
}

export const getUserByCipInCmsts = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { cip },
  } = req;

  console.log("「Get user data by CIP Initialize", cip, {
    params: req.params,
  });

  try {
    const userInCmsts = await fecthUserByCipInCmsts(cip);

    if (isEmpty(userInCmsts))
      res.status(404).json({ message: "user_not_found_in_cmsts" });

    const user = await fetchUserByCip(userInCmsts[0]?.userCip);

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

const fecthUserByCipInCmsts = async (
  cip: string | null
): Promise<CmstsEnrollments[]> =>
  await fetchCollection<CmstsEnrollments>(
    firestore
      .collection("cmsts-enrollments")
      .where("isDeleted", "==", false)
      .where("userCip", "==", cip)
      .limit(1)
  );

const fetchUserByCip = async (cip: string | null): Promise<User[]> =>
  await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("cip", "==", cip)
      .limit(1)
  );
