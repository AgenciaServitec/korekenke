import { firestoreTimestamp } from "../../../../../firebase/firestore";
import { dasRequestsRef } from "../../../../../firebase/collections";
import dayjs from "dayjs";

const DATE_FORMAT = "DD-MM-YYYY";

export const dasRequestsQuery = ({ cip, fromDate, toDate }) => {
  let query = dasRequestsRef.orderBy("createAt", "desc");

  if (fromDate && toDate) {
    query = query
      .where("createAtString", ">=", fromDate)
      .where("createAtString", "<=", toDate);
  }

  if (cip) {
    query = query.where("headline.cip", "==", cip);
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
