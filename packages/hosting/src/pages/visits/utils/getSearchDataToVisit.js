import { concat } from "lodash";

export const getSearchDataToVisit = (visit) =>
  concat([
    visit.phone.number,
    visit.dni,
    visit.paternalSurname.toLowerCase(),
    visit.maternalSurname.toLowerCase(),
    visit.firstName.toLowerCase(),
    visit.middleName.toLowerCase(),
  ]);
