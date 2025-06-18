import { dasRequestsRef } from "../../../../../firebase/collections";

export const dasRequestsQuery = ({
  dasRequestInformation,
  fromDate,
  toDate,
}) => {
  let query = dasRequestsRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (dasRequestInformation) {
    query = query.where(
      "searchData",
      "array-contains-any",
      dasRequestInformation.split(" ").filter((string) => string.trim()),
    );
  }

  if (fromDate) {
    query = query.where("createAt", ">=", fromDate);
  }
  if (toDate) {
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.where("createAt", "<=", endOfDay);
  }

  return query.limit(3000);
};
