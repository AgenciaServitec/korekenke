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
      const emailExists = await isEmailExists(user.email);
      if (emailExists) res.status(412).send("email_already_exists").end();
    }

    if (changePhoneNumber) {
      const phoneNumberExists = await isPhoneNumberExists(user.phoneNumber);
      if (phoneNumberExists)
        res.status(412).send("phone_number_already_exists").end();
    }

    await updateUserAuth(user, changeEmail, changePhoneNumber);
    await updateUser(assignUpdateProps(user));

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
    .update({ ...user });
};

const updateUserAuth = async (
  user: User,
  changeEmail: boolean,
  changePhoneNumber: boolean
): Promise<void> => {
  await auth.updateUser(user.id, {
    ...(changeEmail && { email: user?.email || undefined }),
    ...(changePhoneNumber && {
      phoneNumber: `+51${user?.phoneNumber}` || undefined,
    }),
    password: user?.password || undefined,
  });
};

const isEmailExists = async (email: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("email", "==", email)
  );

  return !isEmpty(users);
};

const isPhoneNumberExists = async (
  phoneNumber: string | null
): Promise<boolean> => {
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
