import { capitalize } from "lodash";

export const userFullName = (user) =>
  `${capitalize(user.firstName)} ${capitalize(
    user.paternalSurname
  )} ${capitalize(user.maternalSurname)}`;
