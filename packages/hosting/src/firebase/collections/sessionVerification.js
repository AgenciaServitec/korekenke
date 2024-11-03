import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { updateDocument } from "../firestore";

export const sessionsVerificationRef = firestore.collection(
  "session-verification",
);

export const getSessionVerificationId = () => sessionsVerificationRef.doc().id;

export const fetchSessionVerification = async (id) =>
  fetchDocumentOnce(sessionsVerificationRef.doc(id));

export const fetchSessionsVerification = async () =>
  fetchCollectionOnce(sessionsVerificationRef.where("isDeleted", "==", false));

export const updateSessionVerification = async (userId, user) =>
  updateDocument(sessionsVerificationRef.doc(userId), user);
