import { dasRequestsRef } from "../../../../../firebase/collections";

export const dasRequestsQuery = ({
  cip,
  firstName,
  paternalSurname,
  fromDate,
  toDate,
}) => {
  let query = dasRequestsRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (cip) {
    query = query.where("headline.cip", "==", cip);
  }

  if (firstName) {
    query = query.where("headline.firstName", "==", firstName);
  }

  if (paternalSurname) {
    query = query.where("headline.paternalSurname", "==", paternalSurname);
  }

  return query.limit(3000);
};
