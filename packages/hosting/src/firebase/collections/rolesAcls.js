import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const rolesAclsRef = firestore.collection("roles-acls");

export const getRoleAclId = () => rolesAclsRef.doc().id;

export const fetchRoleAcl = async (id) =>
  fetchDocumentOnce(rolesAclsRef.doc(id));

export const fetchRolesAcls = async () =>
  fetchCollectionOnce(rolesAclsRef.where("isDeleted", "==", false));

export const addRoleAcl = async (roleAcl) =>
  setDocument(rolesAclsRef.doc(roleAcl.id), roleAcl);

export const updateRoleAcl = async (roleAclId, roleAcl) =>
  updateDocument(rolesAclsRef.doc(roleAclId), roleAcl);
