import { firestore } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";

export const assistancesRef = firestore.collection("assistances");

export const getAssistanceId = (): string => assistancesRef.doc().id;

export const fetchAssistance = async (
  id: string
): Promise<Assistance | undefined> =>
  fetchDocument<Assistance>(assistancesRef.doc(id));

export const fetchAssistances = async (): Promise<Assistance[] | undefined> =>
  fetchCollection(assistancesRef.where("isDeleted", "==", false));

export const fetchTodayAssistancesByUserId = async (
  userId: string
): Promise<Assistance[] | undefined> =>
  fetchCollection<Assistance>(
    assistancesRef.where("userId", "==", userId).where("isDeleted", "==", false)
  );

export const addAssistance = async (assistance: Assistance) =>
  assistancesRef.doc(assistance.id).set(assistance);

export const updateAssistance = async (
  assistanceId: string,
  assistance: Partial<Assistance>
) => assistancesRef.doc(assistanceId).update(assistance);
