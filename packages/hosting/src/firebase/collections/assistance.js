import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import {
  DATE_FORMAT_TO_FIRESTORE,
  setDocument,
  updateDocument,
} from "../firestore";
import dayjs from "dayjs";

export const assistancesRef = firestore.collection("assistances");

export const getAssistancesId = () => assistancesRef.doc().id;

export const fetchAssistance = async (id) =>
  fetchDocumentOnce(assistancesRef.doc(id));

export const fetchAssistances = async () =>
  fetchCollectionOnce(assistancesRef.where("isDeleted", "==", false));

export const fetchAssistancesByUserId = async (userId) => {
  const today = dayjs().format(DATE_FORMAT_TO_FIRESTORE);
  return fetchCollectionOnce(
    assistancesRef
      .where("user.id", "==", userId)
      .where("date", "==", today)
      .where("isDeleted", "==", false),
  );
};

export const addAssistance = async (assistance) =>
  setDocument(assistancesRef.doc(assistance.id), assistance);

export const updateAssistance = async (assistanceId, assistance) =>
  updateDocument(assistancesRef.doc(assistanceId), assistance);