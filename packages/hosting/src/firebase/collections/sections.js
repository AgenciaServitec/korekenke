import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const sectionsRef = firestore.collection("sections");

export const getSectionId = () => sectionsRef.doc().id;

export const fetchSection = async (id) =>
  fetchDocumentOnce(sectionsRef.doc(id));

export const fetchSections = async () =>
  fetchCollectionOnce(sectionsRef.where("isDeleted", "==", false));

export const addSection = async (entity) =>
  setDocument(sectionsRef.doc(entity.id), entity);

export const updateSection = async (entityId, entity) =>
  updateDocument(sectionsRef.doc(entityId), entity);
