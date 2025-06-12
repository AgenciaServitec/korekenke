import { visitsRef } from "../../../firebase/collections";

export const visitsListQuery = ({ visitInformation, fromDate, toDate }) => {
  let query = visitsRef.where("isDeleted", "==", false);

  if (visitInformation) {
    query = query.where(
      "searchData",
      "array-contains-any",
      visitInformation.split(" ").filter((string) => string.trim()),
    );
  }

  if (fromDate && toDate) {
    query = query
      .where("entryDateTime", ">=", fromDate)
      .where("entryDateTime", "<=", toDate)
      .orderBy("entryDateTime", "desc");
  } else {
    query = query.orderBy("createAt", "desc");
  }

  return query.limit(3000);
};
