import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const equineMagazineProfilesRef = (livestockOrEquineId) =>
  firestore
    .collection("livestock-and-equines")
    .doc(livestockOrEquineId)
    .collection("equine-magazine-profiles");

export const getEquineMagazineProfileId = (livestockOrEquineId) =>
  equineMagazineProfilesRef().doc().id;

export const fetchEquineMagazineProfile = async (
  livestockOrEquineId,
  equineMagazineProfileId
) =>
  fetchDocumentOnce(
    equineMagazineProfilesRef(livestockOrEquineId).doc(equineMagazineProfileId)
  );

export const fetchEquineMagazineProfiles = async (livestockOrEquineId) =>
  fetchCollectionOnce(equineMagazineProfilesRef(livestockOrEquineId));

export const addEquineMagazineProfile = async (
  livestockOrEquineId,
  equineMagazineProfile
) =>
  setDocument(
    equineMagazineProfilesRef(livestockOrEquineId).doc(
      equineMagazineProfile.id
    ),
    equineMagazineProfile
  );

export const updateEquineMagazineProfile = async (
  livestockOrEquineId,
  equineMagazineProfileId,
  equineMagazineProfile
) =>
  updateDocument(
    equineMagazineProfilesRef(livestockOrEquineId).doc(equineMagazineProfileId),
    equineMagazineProfile
  );
