import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const correspondencesRef = firestore.collection("correspondences");

export const getCorrespondenceId = () => correspondencesRef.doc().id;

export const fetchCorrespondence = async (id) =>
  fetchDocumentOnce(correspondencesRef.doc(id));

export const fetchCorrespondences = async () =>
  fetchCollectionOnce(correspondencesRef.where("isDeleted", "==", false));

export const addCorrespondence = async (correspondence) =>
  setDocument(correspondencesRef.doc(correspondence.id), correspondence);

export const updateCorrespondence = async (correspondenceId, correspondence) =>
  updateDocument(correspondencesRef.doc(correspondenceId), correspondence);
