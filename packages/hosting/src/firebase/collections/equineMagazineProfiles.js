import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { animalsRef } from "./animals";

export const animalMagazineProfilesRef = (animalId) =>
  animalsRef.doc(animalId).collection("animal-magazine-profiles");

export const getAnimalMagazineProfileId = (animalId) =>
  animalMagazineProfilesRef(animalId).doc().id;

export const fetchAnimalMagazineProfile = async (
  animalId,
  animalIdMagazineProfileId
) =>
  fetchDocumentOnce(
    animalMagazineProfilesRef(animalId).doc(animalIdMagazineProfileId)
  );

export const fetchAnimalMagazineProfiles = async (animalId) =>
  fetchCollectionOnce(animalMagazineProfilesRef(animalId));

export const addAnimalMagazineProfile = async (
  animalId,
  animalIdMagazineProfile
) =>
  setDocument(
    animalMagazineProfilesRef(animalId).doc(animalIdMagazineProfile.id),
    animalIdMagazineProfile
  );

export const updateAnimalMagazineProfile = async (
  animalId,
  animalIdMagazineProfileId,
  animalIdMagazineProfile
) =>
  updateDocument(
    animalMagazineProfilesRef(animalId).doc(animalIdMagazineProfileId),
    animalIdMagazineProfile
  );
