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
    query = query.where("searchData", "array-contains", dasRequestInformation);
  }

  return query.limit(3000);
};
