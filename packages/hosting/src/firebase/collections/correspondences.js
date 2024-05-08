import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";

export const correspondencesRef = firestore.collection("correspondences");

export const getCorrespondenceId = () => correspondencesRef.doc().id;

export const fetchCorrespondence = async (id) =>
  fetchDocumentOnce(correspondencesRef.doc(id));

export const fetchCorrespondences = async () =>
  fetchCollectionOnce(correspondencesRef.where("isDeleted", "==", false));
