import { concat } from "lodash";

export const getSearchDataToVisit = (visit, firstName, middleName) =>
  concat([
    visit.visitorNumber,
    visit.dni,
    visit.paternalSurname.toLowerCase(),
    visit.maternalSurname.toLowerCase(),
    firstName.toLowerCase(),
    middleName.toLowerCase(),
  ]);
