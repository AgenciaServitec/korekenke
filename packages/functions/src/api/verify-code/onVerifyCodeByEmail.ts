import { fetchDocument, firestore } from "../../_firebase";
import { logger } from "../../utils";
import { Timestamp } from "@google-cloud/firestore";

interface SessionVerification {
  id: string;
  type: "email" | "sms";
  userId: string;
  verifyCode: string;
  isVerified: boolean;
  createAt: Timestamp;
}

export const onVerifyCodeByEmail = async (
  req: Request<unknown, unknown, User, unknown>,
  res: Response
): Promise<void> => {
  const { body: user } = req;

  const mapSessionVerification = (user: User): SessionVerification => ({
    id: user.id,
    type: "",
    userId: "",
    verifyCode: "",
    isVerified: false,
    createAt: Timestamp,
  });

  try {
    const _user = await fetchDocument(
      firestore.collection("users").doc(user.id)
    );

    const numberRamdon = Math.floor(
      Math.random() * (800000 - 100000 + 1) + 100000
    );

    await firestore
      .collection("session-verification")
      .doc(user.id)
      .get(mapSessionVerification(user));
  } catch (e) {
    logger.log(e);
  }
};
