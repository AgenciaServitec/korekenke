import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../firestore";

export const correspondencesRef = firestore.collection("receptions");

export const getReceptionId = () => correspondencesRef.doc().id;

export const fetchReception = async (id) =>
  fetchDocumentOnce(correspondencesRef.doc(id));

export const fetchReceptions = async (active) =>
  fetchCollectionOnce(correspondencesRef.where("isDeleted", "==", false));
