import { usersRef } from "../../../firebase/collections";

export const visitsQuery = ({ userInformation }) => {
  let query = usersRef
    .orderBy("createAt", "desc")
    .where("isDeleted", "==", false);

  if (userInformation) {
    query = query.where(
      "searchData",
      "array-contains-any",
      userInformation.split(" ").filter((string) => string.trim()),
    );
  }

  return query.limit(3000);
};
