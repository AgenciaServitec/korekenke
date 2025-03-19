import { concat } from "lodash";

export const getSearchDataToDasRequest = (dasRequest, firstName) =>
  concat(
    [
      dasRequest.phone.number,
      dasRequest.cip,
      dasRequest.email.toLowerCase(),
      dasRequest.paternalSurname.toLowerCase(),
      dasRequest.maternalSurname.toLowerCase(),
    ],
    firstName
      .toLowerCase()
      .split(" ")
      .filter((name) => name.trim()),
  );
