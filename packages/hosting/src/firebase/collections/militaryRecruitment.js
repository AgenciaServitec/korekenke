import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const militaryRecruitmentRef = firestore.collection(
  "military-recruitment",
);

export const getMilitaryRecruitmentId = () => militaryRecruitmentRef.doc().id;

export const fetchMilitaryRecruitment = async (id) =>
  fetchDocumentOnce(militaryRecruitmentRef.doc(id));

export const fetchMilitariesRecruitment = fetchCollectionOnce(
  militaryRecruitmentRef.where("isDeleted", "==", false),
);

export const addMilitaryRecruitment = async (militaryRecruitment) =>
  setDocument(
    militaryRecruitmentRef.doc(militaryRecruitment.id),
    militaryRecruitment,
  );

export const updateMilitaryRecruitment = async (
  militaryRecruitmentId,
  militaryRecruitment,
) =>
  updateDocument(
    militaryRecruitmentRef.doc(militaryRecruitmentId),
    militaryRecruitment,
  );
