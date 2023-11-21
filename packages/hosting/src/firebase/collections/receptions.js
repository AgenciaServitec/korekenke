import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../firestore";

export const receptionsRef = firestore.collection("receptions");

export const getReceptionId = () => receptionsRef.doc().id;

export const fetchReception = async (id) =>
  fetchDocumentOnce(receptionsRef.doc(id));

export const fetchReceptions = async (active) =>
  fetchCollectionOnce(receptionsRef.where("isDeleted", "==", false));
