import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { livestockAndEquinesRef } from "./livestockAndEquines";

export const equineMagazineProfilesRef = (livestockAndEquineId) =>
  livestockAndEquinesRef
    .doc(livestockAndEquineId)
    .collection("equine-magazine-profiles");

export const getEquineMagazineProfileId = (livestockAndEquineId) =>
  equineMagazineProfilesRef(livestockAndEquineId).doc().id;

export const fetchEquineMagazineProfile = async (
  livestockAndEquineId,
  equineMagazineProfileId
) =>
  fetchDocumentOnce(
    equineMagazineProfilesRef(livestockAndEquineId).doc(equineMagazineProfileId)
  );

export const fetchEquineMagazineProfiles = async (livestockAndEquineId) =>
  fetchCollectionOnce(equineMagazineProfilesRef(livestockAndEquineId));

export const addEquineMagazineProfile = async (
  livestockAndEquineId,
  equineMagazineProfile
) =>
  setDocument(
    equineMagazineProfilesRef(livestockAndEquineId).doc(
      equineMagazineProfile.id
    ),
    equineMagazineProfile
  );

export const updateEquineMagazineProfile = async (
  livestockAndEquineId,
  equineMagazineProfileId,
  equineMagazineProfile
) =>
  updateDocument(
    equineMagazineProfilesRef(livestockAndEquineId).doc(
      equineMagazineProfileId
    ),
    equineMagazineProfile
  );
