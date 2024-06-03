import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";

export const livestockAndEquinesRef = firestore.collection(
  "livestock-and-equines"
);

export const getLivestockAndEquineId = () => livestockAndEquinesRef.doc().id;

export const fetchLivestockAndEquine = async (id) =>
  fetchDocumentOnce(livestockAndEquinesRef.doc(id));

export const fetchLivestockAndEquines = async () =>
  fetchCollectionOnce(livestockAndEquinesRef.where("isDeleted", "==", false));
