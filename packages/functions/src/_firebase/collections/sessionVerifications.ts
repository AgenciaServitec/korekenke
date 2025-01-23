import { firestore } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";

export const sessionVerificationsRef = firestore.collection(
  "session-verification"
);

export const getSessionVerificationId = (): string =>
  sessionVerificationsRef.doc().id;

export const fetchSessionVerification = async (
  sessionVerificationId: string
): Promise<SessionVerification | undefined> =>
  fetchDocument<SessionVerification>(
    sessionVerificationsRef.doc(sessionVerificationId)
  );

export const fetchSessionVerifications = async (): Promise<
  SessionVerification[] | undefined
> => fetchCollection(sessionVerificationsRef);

export const updateSessionVerification = (
  sessionVerificationId: string,
  sessionVerification: Partial<SessionVerification>
) =>
  sessionVerificationsRef
    .doc(sessionVerificationId)
    .update(sessionVerification);
