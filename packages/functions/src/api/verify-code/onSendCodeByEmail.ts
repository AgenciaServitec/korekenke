import { NextFunction, Request, Response } from "express";
import { fetchDocument, firestore, firestoreTimestamp } from "../../_firebase";
import { logger } from "../../utils";
import assert from "assert";
import { sendMailSendcodeEmail } from "../../mailer/korekenke";

interface SessionVerification {
  id: string;
  type: "email" | "sms";
  userId: string;
  verifyCode: string;
  isVerified: boolean;
  createAt: string;
}

interface UserId {
  id: string;
}

export const onSendCodeByEmail = async (
  req: Request<unknown, unknown, UserId, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.body;

  try {
    const user = await fetchUser(id);
    assert(user, "Missing user!");

    logger.log("user: ", user);

    const generatedCode = Math.floor(
      Math.random() * (800000 - 100000 + 1) + 100000
    ).toString();

    logger.log("generatedCode: ", generatedCode);

    await Promise.all([
      sendMailSendcodeEmail(user, generatedCode),
      firestore.collection("session-verification").doc(user.id).set({
        id: user.id,
        type: "email",
        userId: user.id,
        verifyCode: generatedCode,
        isVerified: false,
        createAt: firestoreTimestamp.now(),
      }),
    ]);

    res.send(200).end();
  } catch (e) {
    logger.log(e);
    next(e);
  }
};

const fetchUser = async (userId: string): Promise<User | undefined> => {
  return await fetchDocument(firestore.collection("users").doc(userId));
};
