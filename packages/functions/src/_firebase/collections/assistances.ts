import { firestore } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";

export const assistancesRef = firestore.collection("users");

export const getAssistanceId = (): string => assistancesRef.doc().id;

export const fetchAssistance = async (
  assistanceId: string
): Promise<Assistance | undefined> =>
  fetchDocument<Assistance>(assistancesRef.doc(assistanceId));

export const fetchAssistances = async (): Promise<Assistance[] | undefined> =>
  fetchCollection(assistancesRef.where("isDeleted", "==", false));

export const addAssistance = async (assistance: Assistance) =>
  assistancesRef.doc(assistance.id).set(assistance);

export const updateAssistance = (
  assistanceId: string,
  assistance: Partial<Assistance>
) => assistancesRef.doc(assistanceId).update(assistance);
