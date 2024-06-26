import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const dasApplicationsRef = firestore.collection("das-applications");

export const getDasApplicationId = () => dasApplicationsRef.doc().id;

export const fetchDasApplication = async (id) =>
  fetchDocumentOnce(dasApplicationsRef.doc(id));

export const fetchDasApplications = async () =>
  fetchCollectionOnce(dasApplicationsRef.where("isDeleted", "==", false));

export const addDasApplication = async (dasApplicant) =>
  setDocument(dasApplicationsRef.doc(dasApplicant.id), dasApplicant);

export const updateDasApplication = async (dasApplicantId, dasApplicant) =>
  updateDocument(dasApplicationsRef.doc(dasApplicantId), dasApplicant);
