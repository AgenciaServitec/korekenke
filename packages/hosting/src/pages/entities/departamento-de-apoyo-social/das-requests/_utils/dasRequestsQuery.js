import { dasRequestsRef } from "../../../../../firebase/collections";

export const dasRequestsQuery = ({ cip, fromDate, toDate }) => {
  let query = dasRequestsRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (cip) {
    query = query.where("headline.cip", "==", cip);
  }

  return query.limit(3000);
};
