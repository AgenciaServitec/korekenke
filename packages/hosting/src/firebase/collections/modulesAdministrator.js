import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const modulesAdministratorRef = firestore.collection(
  "modules-administrator",
);

export const getModuleAdministratorId = () => modulesAdministratorRef.doc().id;

export const fetchModuleAdministrator = async (id) =>
  fetchDocumentOnce(modulesAdministratorRef.doc(id));

export const fetchModuleAdministrators = async () =>
  fetchCollectionOnce(modulesAdministratorRef.where("isDeleted", "==", false));

export const addModuleAdministrator = async (module) =>
  setDocument(modulesAdministratorRef.doc(module.id), module);

export const updateModuleAdministrator = async (moduleId, module) =>
  updateDocument(modulesAdministratorRef.doc(moduleId), module);
