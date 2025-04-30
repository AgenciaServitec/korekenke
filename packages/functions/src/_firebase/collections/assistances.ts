import { firestore, firestoreTimestamp } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";
import { DocumentCreate } from "../../globalTypes";
import moment from "moment";

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
): Promise<Assistance[] | undefined> => {
  const todayStart = moment().tz("America/Lima").startOf("day").toDate();
  const todayEnd = moment().tz("America/Lima").endOf("day").toDate();

  return fetchCollection<Assistance>(
    assistancesRef
      .where("userId", "==", userId)
      .where(
        "entry.dateTimestamp",
        ">=",
        firestoreTimestamp.fromDate(todayStart)
      )
      .where("entry.dateTimestamp", "<=", firestoreTimestamp.fromDate(todayEnd))
      .where("isDeleted", "==", false)
      .limit(1)
  );
};

export const addAssistance = async (
  assistance: {
    entry: { date: FirebaseFirestore.Timestamp };
    id: string;
    createAtString: string;
    outlet: null;
    userId: string;
    user: User;
    workPlace: string | null;
  } & DocumentCreate
) => assistancesRef.doc(assistance.id).set(assistance);

export const updateAssistance = async (
  assistanceId: string,
  assistance: Partial<Assistance>
) => assistancesRef.doc(assistanceId).update(assistance);
