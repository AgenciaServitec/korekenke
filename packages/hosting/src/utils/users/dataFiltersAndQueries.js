import { useGlobalData } from "../../providers";
import { DegreesArmy } from "../../data-list";

export const findRole = (roleCode) => {
  const { rolesAcls } = useGlobalData();
  return rolesAcls.find((role) => role.id === roleCode);
};

export const findDegree = (degreeCode) =>
  DegreesArmy.flatMap((degreeArmy) => degreeArmy.options).find(
    (degree) => degree.value === degreeCode
  );
