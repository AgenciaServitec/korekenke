import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils";
import { fetchDocument, firestore, firestoreTimestamp } from "../../_firebase";
import assert from "assert";
import { verifyEmailSendCode } from "../../mailer/korekenke/VerifyEmail.SendCode";
import { isEmpty } from "lodash";

interface BodyProps {
  userId: string;
}

export const postSendCode = async (
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
      res.status(412).send("error_verify/send_code").end();
      return;
    }

    assert(user, "Missing user!");
    const existsSessionVerification = await fetchDocument(
      firestore.collection("session-verification").doc(user.id)
    );

    if (!isEmpty(existsSessionVerification)) {
      res.status(412).send("verify_code_exists").end();
      return;
    }

    const sessionVerification = verifyEmailMap({
      userId: user.id,
      email: user.email as string,
      verifyCode: generateUniqueRandomNumber(),
    });

    const p0 = verifyEmailSendCode(sessionVerification);
    const p1 = addSessionVerification(sessionVerification);

    await Promise.all([p0, p1]);

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verifyEmailMap = ({
  userId,
  email,
  verifyCode,
}: {
  userId: string;
  email: string;
  verifyCode: string;
}): SessionVerification => ({
  id: userId,
  userId: userId,
  type: "email",
  email: email,
  verifyCode: verifyCode,
  isVerified: false,
  createAt: firestoreTimestamp.now(),
});

const addSessionVerification = async (
  sessionVerification: SessionVerification
) => {
  await firestore
    .collection("session-verification")
    .doc(sessionVerification.userId)
    .set({ ...sessionVerification });
};

const generateUniqueRandomNumber = () => {
  const generatedNumbers = new Set();

  let randomNumber;
  do {
    randomNumber = Math.floor(100000 + Math.random() * 900000);
  } while (generatedNumbers.has(randomNumber));

  generatedNumbers.add(randomNumber);
  return randomNumber.toString();
};
