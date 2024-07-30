import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const animalsRef = firestore.collection("animals");

export const getAnimalId = () => animalsRef.doc().id;

export const fetchAnimal = async (id) => fetchDocumentOnce(animalsRef.doc(id));

export const fetchAnimals = async () =>
  fetchCollectionOnce(animalsRef.where("isDeleted", "==", false));

export const addAnimal = async (animal) =>
  setDocument(animalsRef.doc(animal.id), animal);

export const updateAnimal = async (animalId, animal) =>
  updateDocument(animalsRef.doc(animalId), animal);
