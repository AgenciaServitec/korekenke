import { dasRequestsRef } from "../../../../../firebase/collections";

export const dasRequestsQuery = ({ cip, firstName, fromDate, toDate }) => {
  let query = dasRequestsRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (cip) {
    query = query.where("headline.cip", "==", cip);
  }

  if (firstName) {
    query = query.where("headline.firstName", "==", firstName);
  }

  return query.limit(3000);
};
