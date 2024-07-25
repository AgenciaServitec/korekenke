import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const unitsRef = firestore.collection("units");

export const getUnitId = () => unitsRef.doc().id;

export const fetchUnit = async (id) => fetchDocumentOnce(unitsRef.doc(id));

export const fetchUnits = async () =>
  fetchCollectionOnce(unitsRef.where("isDeleted", "==", false));

export const addUnit = async (unit) => setDocument(unitsRef.doc(unit.id), unit);

export const updateUnit = async (unitId, unit) =>
  updateDocument(unitsRef.doc(unitId), unit);
