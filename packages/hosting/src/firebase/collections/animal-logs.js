import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const animalLogsRef = firestore.collection("animal-logs");

export const getAnimalLogId = () => animalLogsRef.doc().id;

export const fetchAnimalLog = async (id) =>
  fetchDocumentOnce(animalLogsRef.doc(id));

export const fetchAnimalLogs = async () =>
  fetchCollectionOnce(animalLogsRef.where("isDeleted", "==", false));

export const addAnimalLog = async (animalLog) =>
  setDocument(animalLogsRef.doc(animalLog.id), animalLog);

export const updateAnimalLog = async (animalLogId, animalLog) =>
  updateDocument(animalLogsRef.doc(animalLogId), animalLog);
