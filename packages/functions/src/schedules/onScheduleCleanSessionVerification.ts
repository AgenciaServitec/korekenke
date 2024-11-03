import type { OnSchedule } from "./interface";
import moment from "moment";
import { firestoreTimestamp, fetchCollection, firestore } from "../_firebase";
import { isEmpty } from "lodash";
import { logger } from "../utils";

const LIMIT = 500;

export const onScheduleCleanSessionVerification: OnSchedule = async () => {
  try {
    await CleanSessionVerification();
  } catch (e) {
    logger.error(e);
  }
};

const CleanSessionVerification = async (): Promise<void> => {
  let resultsLength = -1;
  let lastStartAfter = firestoreTimestamp.fromDate(
    moment().tz("America/Lima").subtract(1, "minutes").toDate()
  );

  do {
    const sessionsVerification = await fetchCollection<SessionVerification>(
      firestore
        .collection("session-verification")
        .orderBy("createAt", "desc")
        .startAfter(lastStartAfter)
        .limit(LIMIT)
    );

    if (isEmpty(sessionsVerification)) return;

    resultsLength = sessionsVerification.length;
    lastStartAfter = sessionsVerification.slice(-1)[0].createAt;

    await Promise.all(
      sessionsVerification.map((sessionVerification) =>
        firestore
          .collection("session-verification")
          .doc(sessionVerification.id)
          .delete()
      )
    );
  } while (resultsLength === LIMIT);
};
