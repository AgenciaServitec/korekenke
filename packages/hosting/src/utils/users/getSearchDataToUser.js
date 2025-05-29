import { concat } from "lodash";

export const getSearchDataToUser = (user, firstName) =>
  concat(
    [
      user.phoneNumber,
      user.cip,
      user.dni,
      user?.bloodGroup,
      user.email.toLowerCase(),
      user.paternalSurname.toLowerCase(),
      user.maternalSurname.toLowerCase(),
    ],
    firstName
      .toLowerCase()
      .split(" ")
      .filter((name) => name.trim()),
  );
