import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const officesRef = firestore.collection("offices");

export const getOfficeId = () => officesRef.doc().id;

export const fetchOffice = async (id) => fetchDocumentOnce(officesRef.doc(id));

export const fetchOffices = async () =>
  fetchCollectionOnce(officesRef.where("isDeleted", "==", false));

export const addOffice = async (entity) =>
  setDocument(officesRef.doc(entity.id), entity);

export const updateOffice = async (entityId, entity) =>
  updateDocument(officesRef.doc(entityId), entity);
