import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const assistancesRef = firestore.collection("assistances");

export const getAssistancesId = () => assistancesRef.doc().id;

export const fetchAssistance = async (id) =>
  fetchDocumentOnce(assistancesRef.doc(id));

export const fetchAssistances = async () =>
  fetchCollectionOnce(assistancesRef.where("isDeleted", "==", false));

export const fetchTodayAssistancesByUserId = async (userId) => {
  return fetchCollectionOnce(
    assistancesRef
      .where("userId", "==", userId)
      .where("isDeleted", "==", false),
  );
};

export const addAssistance = async (assistance) =>
  setDocument(assistancesRef.doc(assistance.id), assistance);

export const updateAssistance = async (assistanceId, assistance) =>
  updateDocument(assistancesRef.doc(assistanceId), assistance);
