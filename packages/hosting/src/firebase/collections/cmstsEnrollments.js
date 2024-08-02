import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const cmstsEnrollmentsRef = firestore.collection("cmsts-enrollments");

export const getCmstsEnrollmentId = () => cmstsEnrollmentsRef.doc().id;

export const fetchCmstsEnrollment = async (id) =>
  fetchDocumentOnce(cmstsEnrollmentsRef.doc(id));

export const fetchCmstsEnrollments = async () =>
  fetchCollectionOnce(cmstsEnrollmentsRef.where("isDeleted", "==", false));

export const addCmstsEnrollment = async (cmstsEnrollment) =>
  setDocument(cmstsEnrollmentsRef.doc(cmstsEnrollment.id), cmstsEnrollment);

export const updateCmstsEnrollment = async (
  cmstsEnrollmentId,
  cmstsEnrollment,
) =>
  updateDocument(cmstsEnrollmentsRef.doc(cmstsEnrollmentId), cmstsEnrollment);
