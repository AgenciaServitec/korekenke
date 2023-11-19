import {
  auth,
  fetchCollection,
  fetchDocument,
  firestore,
} from "../../_firebase";
import { NextFunction, Request, Response } from "express";
import { isEmpty } from "lodash";
import assert from "assert";
import { defaultFirestoreProps } from "../../utils";

interface Params {
  userId: string;
}

const { assignUpdateProps } = defaultFirestoreProps();

export const putUser = async (
  req: Request<Params, unknown, User, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { userId },
    body: user,
  } = req;

  console.log(userId, "「Update user」Initialize", {
    params: req.params,
    body: req.body,
  });

  try {
    const userFirestore = await fetchUser(user.id);
    const changeEmail = userFirestore.email !== user.email;
    const changePhoneNumber = userFirestore.phoneNumber !== user.phoneNumber;

    if (changeEmail) {
      assert(user.email, "missing user.email!");
      const emailExists = await isEmailExists(user.email);

      if (emailExists) res.status(412).send("email_already_exists").end();
    }

    if (changePhoneNumber) {
      assert(user.phoneNumber, "missing user.phoneNumber!");
      const phoneNumberExists = await isPhoneNumberExists(user.phoneNumber);

      if (phoneNumberExists)
        res.status(412).send("phone_number_already_exists").end();
    }

    const p0 = updateUser(assignUpdateProps(user));
    const p1 = updateUserAuth(user, changeEmail, changePhoneNumber);

    await Promise.all([p0, p1]);

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateUser = async (user: User): Promise<void> => {
  await firestore
    .collection("users")
    .doc(user.id)
    .set({ ...user }, { merge: true });
};

const updateUserAuth = async (
  user: User,
  changeEmail: boolean,
  changePhoneNumber: boolean
): Promise<void> => {
  await auth.updateUser(user.id, {
    ...(changeEmail && { email: user.email || undefined }),
    ...(changePhoneNumber && { phoneNumber: user.phoneNumber || undefined }),
    password: user?.password || undefined,
  });
};

const isEmailExists = async (email: string): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("email", "==", email)
  );

  return !isEmpty(users);
};

const isPhoneNumberExists = async (phoneNumber: string): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("phoneNumber", "==", phoneNumber)
  );

  return !isEmpty(users);
};

const fetchUser = async (userId: string): Promise<User> => {
  const user = await fetchDocument<User>(
    firestore.collection("users").doc(userId)
  );

  assert(user, `User doesn't exist: ${userId}`);

  return user;
};
