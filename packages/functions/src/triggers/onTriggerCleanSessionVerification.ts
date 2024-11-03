import type { OnDocumentCreated } from "./interface";
import { firestore } from "../_firebase";
import { logger } from "../utils";
import assert from "assert";

export const onTriggerCleanSessionVerification: OnDocumentCreated = async (
  event
) => {
  try {
    const sessionVerification = event.data?.data() as
      | SessionVerification
      | undefined;

    assert(sessionVerification, "Missing sessionVerification!");

    await CleanSessionVerification(sessionVerification);
  } catch (e) {
    logger.error(e);
  }
};

const CleanSessionVerification = async (
  sessionVerification: SessionVerification
): Promise<void> => {
  setTimeout(async () => {
    await firestore
      .collection("session-verification")
      .doc(sessionVerification.id)
      .delete();
  }, 60000);
};
