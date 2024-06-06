import { capitalize } from "lodash";

export const userFullName = (user) =>
  `${capitalize(user.paternalSurname)} ${capitalize(
    user.maternalSurname
  )} ${capitalize(user.firstName)}`;
