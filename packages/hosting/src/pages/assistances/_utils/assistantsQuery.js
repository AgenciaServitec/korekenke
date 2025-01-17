import { assistancesRef } from "../../../firebase/collections/assistance";
import { firestoreTimestamp } from "../../../firebase/firestore";
import dayjs from "dayjs";

const DATE_FORMAT = "DD-MM-YYYY";

export const assistancesQuery = ({ cip, fromDate, toDate }) => {
  let query = assistancesRef.orderBy("createAt", "desc");

  if (fromDate && toDate) {
    query = query.where("date", ">=", fromDate).where("date", "<=", toDate);
  }

  if (cip) {
    query = query.where("cip", "==", cip);
  }

  const [startDate, endDate] = dateRange(fromDate, toDate);

  query = query
    .startAt(firestoreTimestamp.fromDate(endDate))
    .endAt(firestoreTimestamp.fromDate(startDate));

  return query.limit(3000);
};

const dateRange = (fromDate, toDate) => {
  const startDate = dayjs(fromDate, DATE_FORMAT).startOf("day").toDate();
  const endDate = dayjs(toDate, DATE_FORMAT).endOf("day").toDate();

  return [startDate, endDate];
};
