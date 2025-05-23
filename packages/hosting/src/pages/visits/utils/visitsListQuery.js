import { visitsRef } from "../../../firebase/collections";

export const visitsListQuery = ({ visitInformation }) => {
  let query = visitsRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (visitInformation) {
    query = query.where(
      "searchData",
      "array-contains-any",
      visitInformation.split(" ").filter((string) => string.trim()),
    );
  }

  return query.limit(3000);
};
