import { firestore } from "../index";
import { fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const visitsRef = firestore.collection("visits");

export const getVisitsId = () => visitsRef.doc().id;

export const fetchVisit = async (id) => fetchDocumentOnce(visitsRef.doc(id));

export const fetchVisits = async () =>
  fetchDocumentOnce(visitsRef.where("isDeleted", "==", false));

export const addVisit = async (visit) =>
  setDocument(visitsRef.doc(visit.id), visit);

export const updateVisit = async (visitId, visit) =>
  updateDocument(visitsRef.doc(visitId), visit);
