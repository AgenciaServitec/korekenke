import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const departmentsRef = firestore.collection("departments");

export const getDepartmentId = () => departmentsRef.doc().id;

export const fetchDepartment = async (id) =>
  fetchDocumentOnce(departmentsRef.doc(id));

export const fetchDepartments = async () =>
  fetchCollectionOnce(departmentsRef.where("isDeleted", "==", false));

export const addDepartment = async (entity) =>
  setDocument(departmentsRef.doc(entity.id), entity);

export const updateDepartment = async (entityId, entity) =>
  updateDocument(departmentsRef.doc(entityId), entity);
