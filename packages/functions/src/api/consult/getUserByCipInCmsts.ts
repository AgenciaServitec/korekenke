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
    const isUserBelongInCmsts = await fecthUserByCipInCmsts(cip);

    if (isEmpty(isUserBelongInCmsts))
      res.status(404).send("user_not_found_in_cmsts");

    res.send("user_registered_in_cmsts");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const fecthUserByCipInCmsts = async (cip: string | null): Promise<User[]> =>
  await fetchCollection<User>(
    firestore
      .collection("cmsts-enrollments")
      .where("isDeleted", "==", false)
      .where("userCip", "==", cip)
      .limit(1)
  );
