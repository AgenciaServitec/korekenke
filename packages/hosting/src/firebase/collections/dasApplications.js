import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

// das-requests === das-applications in Firestore

export const dasRequestsRef = firestore.collection("das-applications");

export const getDasRequestId = () => dasRequestsRef.doc().id;

export const fetchDasRequest = async (id) =>
  fetchDocumentOnce(dasRequestsRef.doc(id));

export const fetchDasRequests = async () =>
  fetchCollectionOnce(dasRequestsRef.where("isDeleted", "==", false));

export const addDasRequest = async (dasRequest) =>
  setDocument(dasRequestsRef.doc(dasRequest.id), dasRequest);

export const updateDasRequest = async (dasRequestId, dasRequest) =>
  updateDocument(dasRequestsRef.doc(dasRequestId), dasRequest);
