import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const clinicHistoriesRef = (livestockOrEquineId) =>
  firestore
    .collection("livestock-and-equines")
    .doc(livestockOrEquineId)
    .collection("clinic-history");

export const getClinicHistoryId = (livestockOrEquineId) =>
  clinicHistoriesRef().doc().id;

export const fetchClinicHistory = async (
  livestockOrEquineId,
  clinicHistoryId
) =>
  fetchDocumentOnce(
    clinicHistoriesRef(livestockOrEquineId).doc(clinicHistoryId)
  );

export const fetchClinicHistories = async (livestockOrEquineId) =>
  fetchCollectionOnce(clinicHistoriesRef(livestockOrEquineId));

export const addClinicHistory = async (livestockOrEquineId, clinicHistory) =>
  setDocument(
    clinicHistoriesRef(livestockOrEquineId).doc(clinicHistory.id),
    clinicHistory
  );

export const updateClinicHistory = async (
  livestockOrEquineId,
  clinicHistoryId,
  clinicHistory
) =>
  updateDocument(
    clinicHistoriesRef(livestockOrEquineId).doc(clinicHistoryId),
    clinicHistory
  );
