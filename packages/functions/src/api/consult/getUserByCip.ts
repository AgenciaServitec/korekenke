import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore } from "../../_firebase";
import { isEmpty } from "lodash";

interface Params {
  cip: string;
}

export const getUserByCip = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { cip },
  } = req;

  console.log("「Get entity data」Initialize", cip, {
    params: req.params,
  });

  try {
    const users = await fecthUserByCip(cip);

    if (isEmpty(users)) res.status(412).send("user_not_found_in_cmsts").end();

    res.send(users[0]).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const fecthUserByCip = async (cip: string | null): Promise<User[]> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("cip", "==", cip)
      .limit(1)
  );

  return users;
};
