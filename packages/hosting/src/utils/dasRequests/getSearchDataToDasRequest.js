import { concat } from "lodash";

export const getSearchDataToDasRequest = (searchData, firstName) =>
  concat(
    searchData,
    firstName.split(" ").filter((name) => name.trim()),
  );
