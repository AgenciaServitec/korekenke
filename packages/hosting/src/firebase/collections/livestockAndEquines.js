import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const livestockAndEquinesRef = firestore.collection(
  "livestock-and-equines"
);

export const getLivestockAndEquineId = () => livestockAndEquinesRef.doc().id;

export const fetchLivestockAndEquine = async (id) =>
  fetchDocumentOnce(livestockAndEquinesRef.doc(id));

export const fetchLivestockAndEquines = async () =>
  fetchCollectionOnce(livestockAndEquinesRef.where("isDeleted", "==", false));

export const addLivestockAndEquine = async (livestockAndEquine) =>
  setDocument(
    livestockAndEquinesRef.doc(livestockAndEquine.id),
    livestockAndEquine
  );

export const updateLivestockAndEquine = async (
  livestockAndEquineId,
  livestockAndEquine
) =>
  updateDocument(
    livestockAndEquinesRef.doc(livestockAndEquineId),
    livestockAndEquine
  );
