import { NextFunction, Request, Response } from "express";
import { fetchDocument, firestore, firestoreTimestamp } from "../../_firebase";
import { logger } from "../../utils";
import assert from "assert";
import { sendMailSendcodeEmail } from "../../mailer/korekenke";
import { isEmpty } from "lodash";

interface SessionVerification {
  id: string;
  type: "email" | "sms";
  userId: string;
  verifyCode: string;
  isVerified: boolean;
  createAt: string;
}

interface VerifyCode {
  id: string;
  code: string;
}

export const onVerificationCode = async (
  req: Request<unknown, unknown, VerifyCode, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, code } = req.body;

  try {
    const user = await fetchUser(id);
    assert(user, "Missing user!");

    const generatedCode = await fetchVerifyCode(id);
    assert(generatedCode, "Missing generatedCode!");

    logger.log("user: ", user);
    logger.log("generatedCode: ", generatedCode);

    if (isEmpty(generatedCode)) {
      res.send(412).end();
    }

    res.send(200).end();
  } catch (e) {
    logger.log(e);
    next(e);
  }
};

const fetchUser = async (userId: string): Promise<User | undefined> => {
  return await fetchDocument(firestore.collection("users").doc(userId));
};

const fetchVerifyCode = async (userId: string): Promise<string | undefined> => {
  return await fetchDocument(
    firestore.collection("session-verification").doc(userId)
  );
};
