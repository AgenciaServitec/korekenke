import { firestore } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";

export const cmstsEnrollmentsRef = firestore.collection("cmsts-enrollments");

export const getCmstsEnrollmentId = (): string => cmstsEnrollmentsRef.doc().id;

export const fetchCmstsEnrollment = async (
  id: string
): Promise<CmstsEnrollments | undefined> =>
  fetchDocument<CmstsEnrollments>(cmstsEnrollmentsRef.doc(id));

export const fetchCmstsEnrollments = async (): Promise<
  CmstsEnrollments[] | undefined
> => fetchCollection(cmstsEnrollmentsRef.where("isDeleted", "==", false));

export const fetchTodayCmstsEnrollmentsByUserId = async (
  userId: string
): Promise<CmstsEnrollments[] | undefined> =>
  fetchCollection<CmstsEnrollments>(
    cmstsEnrollmentsRef
      .where("userId", "==", userId)
      .where("isDeleted", "==", false)
  );

export const addCmstsEnrollment = async (assistance: CmstsEnrollments) =>
  cmstsEnrollmentsRef.doc(assistance.id).set(assistance);

export const updateCmstsEnrollment = async (
  assistanceId: string,
  assistance: Partial<CmstsEnrollments>
) => cmstsEnrollmentsRef.doc(assistanceId).update(assistance);
