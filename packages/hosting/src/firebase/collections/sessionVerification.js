import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { updateDocument } from "../firestore";

export const sessionsVerificationRef = firestore.collection(
  "session-verification",
);

export const getSessionVerificationId = () => sessionsVerificationRef.doc().id;

export const fetchSessionVerification = async (id) =>
  fetchDocumentOnce(sessionsVerificationRef.doc(id));

export const deleteSessionVerification = async (id) =>
  sessionsVerificationRef.doc(id).delete();

export const fetchSessionsVerification = async () =>
  fetchCollectionOnce(sessionsVerificationRef.where("isDeleted", "==", false));

export const updateSessionVerification = async (userId, sessionVerification) =>
  updateDocument(sessionsVerificationRef.doc(userId), sessionVerification);
