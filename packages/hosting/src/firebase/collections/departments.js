import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { entitiesRef } from "./entities";

export const departmentsRef = firestore.collection("departments");

export const getDepartmentId = () => departmentsRef.doc().id;

export const fetchDepartment = async (id) =>
  fetchDocumentOnce(departmentsRef.doc(id));

export const fetchDepartments = async () =>
  fetchCollectionOnce(departmentsRef.where("isDeleted", "==", false));

export const fetchDepartmentByNameId = async (nameId) =>
  fetchCollectionOnce(
    departmentsRef
      .where("nameId", "==", nameId)
      .where("isDeleted", "==", false)
      .limit(1),
  );

export const addDepartment = async (department) =>
  setDocument(departmentsRef.doc(department.id), department);

export const updateDepartment = async (departmentId, department) =>
  updateDocument(departmentsRef.doc(departmentId), department);
