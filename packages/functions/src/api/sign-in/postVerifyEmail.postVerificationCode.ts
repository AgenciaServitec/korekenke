import { NextFunction, Request, Response } from "express";
import { fetchDocument, firestore } from "../../_firebase";
import { logger } from "../../utils";
import assert from "assert";
import { isEmpty } from "lodash";

interface VerifyCode {
  userId: string;
  verifyCode: string;
}

export const postVerificationCode = async (
  req: Request<unknown, unknown, VerifyCode, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, verifyCode } = req.body;

  try {
    const user = await fetchUser(userId);
    assert(user, "Missing user!");

    const _verifyCode = await fetchVerifyCode(userId);
    if (
      isEmpty(_verifyCode) ||
      userId !== user.id ||
      verifyCode !== _verifyCode?.verifyCode
    ) {
      res.send(false).end();
      return;
    }

    res.send(true).end();
  } catch (e) {
    logger.log(e);
    next(e);
  }
};

const fetchUser = async (userId: string): Promise<User | undefined> => {
  return await fetchDocument(firestore.collection("users").doc(userId));
};

const fetchVerifyCode = async (
  userId: string
): Promise<SessionVerification | undefined> => {
  return await fetchDocument(
    firestore.collection("session-verification").doc(userId)
  );
};
