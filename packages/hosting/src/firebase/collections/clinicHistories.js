import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const clinicHistoriesRef = (animalId) =>
  firestore.collection("animals").doc(animalId).collection("clinic-history");

export const getClinicHistoryId = (animalId) => clinicHistoriesRef().doc().id;

export const fetchClinicHistory = async (animalId, clinicHistoryId) =>
  fetchDocumentOnce(clinicHistoriesRef(animalId).doc(clinicHistoryId));

export const fetchClinicHistories = async (animalId) =>
  fetchCollectionOnce(clinicHistoriesRef(animalId));

export const addClinicHistory = async (animalId, clinicHistory) =>
  setDocument(
    clinicHistoriesRef(animalId).doc(clinicHistory.id),
    clinicHistory,
  );

export const updateClinicHistory = async (
  animalId,
  clinicHistoryId,
  clinicHistory,
) =>
  updateDocument(
    clinicHistoriesRef(animalId).doc(clinicHistoryId),
    clinicHistory,
  );
