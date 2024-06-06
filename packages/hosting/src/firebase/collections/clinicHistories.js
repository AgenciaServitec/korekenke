import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const clinicHistoriesRef = (livestockAndEquineId) =>
  firestore
    .collection("livestock-and-equines")
    .doc(livestockAndEquineId)
    .collection("clinic-history");

export const getClinicHistoryId = (livestockAndEquineId) =>
  clinicHistoriesRef().doc().id;

export const fetchClinicHistory = async (
  livestockAndEquineId,
  clinicHistoryId
) =>
  fetchDocumentOnce(
    clinicHistoriesRef(livestockAndEquineId).doc(clinicHistoryId)
  );

export const fetchClinicHistories = async (livestockAndEquineId) =>
  fetchCollectionOnce(clinicHistoriesRef(livestockAndEquineId));

export const addClinicHistory = async (livestockAndEquineId, clinicHistory) =>
  setDocument(
    clinicHistoriesRef(livestockAndEquineId).doc(clinicHistory.id),
    clinicHistory
  );

export const updateClinicHistory = async (
  livestockAndEquineId,
  clinicHistoryId,
  clinicHistory
) =>
  updateDocument(
    clinicHistoriesRef(livestockAndEquineId).doc(clinicHistoryId),
    clinicHistory
  );
