import { firestore } from "../index";

export const correspondencesRef = firestore.collection("correspondences");
//
// export const getReceptionId = () => correspondencesRef.doc().id;
//
// export const fetchReception = async (id) =>
//   fetchDocumentOnce(correspondencesRef.doc(id));
//
// export const fetchReceptions = async () =>
//   fetchCollectionOnce(correspondencesRef.where("isDeleted", "==", false));
