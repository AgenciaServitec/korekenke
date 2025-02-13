import { NextFunction, Request, Response } from "express";
import { generatePassword, logger } from "../../utils";
import { auth, fetchDocument, firestore } from "../../_firebase";
import assert from "assert";
import { verifyEmailSendPassword } from "../../mailer/korekenke/VerifyEmail.SendPassword";

interface BodyProps {
  userId: string;
}

export const postSendPassword = async (
  req: Request<unknown, unknown, BodyProps, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: bodyData } = req;

    console.log("「Add user」Initialize", {
      params: req.params,
      body: req.body,
    });

    assert(bodyData, "Missing userId!");

    logger.log("bodyData: ", bodyData);

    const user = await fetchDocument<User>(
      firestore.collection("users").doc(bodyData.userId)
    );

    if (!user || !bodyData) {
      res.status(412).send("error_verify/send_password").end();
      return;
    }

    assert(user, "Missing user!");

    const emailPassword = generatePassword();

    const p0 = verifyEmailSendPassword(user, emailPassword);
    const p1 = updateUserAuth({ ...user, password: emailPassword });
    const p2 = updateUser({ ...user, password: emailPassword });

    await Promise.all([p0, p1, p2]);

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateUserAuth = async (user: User): Promise<void> => {
  await auth.updateUser(user.id, {
    email: user.email as string,
    password: user.password as string,
  });
};

const updateUser = async (user: User): Promise<void> => {
  await firestore
    .collection("users")
    .doc(user.id)
    .update({ ...user });
};
