import { DegreesArmy } from "../../data-list";

export const findRole = (rolesAcls = [], roleCode) =>
  rolesAcls.find((role) => role.id === roleCode);

export const findDegree = (degreeCode) =>
  DegreesArmy.flatMap((degreeArmy) => degreeArmy.options).find(
    (degree) => degree.value === degreeCode,
  );
