import type { OnDocumentCreated } from "./interface";
import { firestore } from "../_firebase";
import { logger } from "../utils";
import assert from "assert";
import moment from "moment";
import { fetchSessionVerifications } from "../_firebase/collections/sessionVerifications";

export const onTriggerCleanSessionVerification: OnDocumentCreated = async (
  event
) => {
  try {
    const sessionVerification = event.data?.data() as
      | SessionVerification
      | undefined;

    const sessionVerifications = await fetchSessionVerifications();

    const todayVerifications = sessionVerifications?.filter(
      (sessionVerification) =>
        moment(sessionVerification.createAt).isBefore(moment())
    );

    for (const sessionVerification of todayVerifications || []) {
      assert(sessionVerification, "Missing sessionVerification!");

      await CleanSessionVerification(sessionVerification);
    }

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
