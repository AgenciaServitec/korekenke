import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const holidaysRef = firestore.collection("holidays");

export const getHolidaysId = () => holidaysRef.doc().id;

export const fetchHoliday = async (id) =>
  fetchDocumentOnce(holidaysRef.doc(id));

export const fetchHolidays = async () =>
  fetchCollectionOnce(holidaysRef.where("isDeleted", "==", false));

export const addHoliday = async (holiday) =>
  setDocument(holidaysRef.doc(holiday.id), holiday);

export const updateHoliday = async (holidayId, holiday) =>
  updateDocument(holidaysRef.doc(holidayId), holiday);
