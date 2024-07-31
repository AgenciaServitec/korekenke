import { capitalize } from "lodash";

export const userFullName = (user) => {
  if (!user) return null;

  return `${capitalize(user.firstName)} ${capitalize(
    user.paternalSurname,
  )} ${capitalize(user.maternalSurname)}`;
};
