import { firestore } from "../index";
import { fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const tutorialsRef = firestore.collection("tutorials");

export const getTutorialsId = () => tutorialsRef.doc().id;

export const fetchTutorial = async (id) =>
  fetchDocumentOnce(tutorialsRef.doc(id));

export const fetchTutorials = async () =>
  fetchDocumentOnce(tutorialsRef.where("isDeleted", "==", false));

export const addTutorial = async (tutorial) =>
  setDocument(tutorialsRef.doc(tutorial.id), tutorial);

export const updateTutorial = async (tutorialId, tutorial) =>
  updateDocument(tutorialsRef.doc(tutorialId), tutorial);
