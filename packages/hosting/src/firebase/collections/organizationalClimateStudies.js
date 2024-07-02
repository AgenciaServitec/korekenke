import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const organizationalClimateStudiesRef = firestore.collection("organizational-climate-studies-surveys");

export const getOrganizationalClimateStudyId = () => organizationalClimateStudiesRef.doc().id;

export const fetchOrganizationalClimateStudy = async (id) => fetchDocumentOnce(organizationalClimateStudiesRef.doc(id));

export const fetchOrganizationalClimateStudies = async () =>
  fetchCollectionOnce(organizationalClimateStudiesRef.where("isDeleted", "==", false));

export const addOrganizationalClimateStudy = async (organizationalClimateStudy) =>
  setDocument(organizationalClimateStudiesRef.doc(organizationalClimateStudy.id), organizationalClimateStudy);

export const updateOrganizationalClimateStudy = async (organizationalClimateStudyId, organizationalClimateStudy) =>
  updateDocument(organizationalClimateStudiesRef.doc(organizationalClimateStudyId), organizationalClimateStudy);
