import {
  departmentsRef,
  entitiesRef,
  fetchUser,
} from "../firebase/collections";
import { useCommand } from "../providers";
import { fetchCollectionOnce } from "../firebase/firestore";

export const useBosses = () => {
  const { currentCommand } = useCommand();

  const fetchEntityManager = async (nameId) => {
    const entitiesGU = await fetchCollectionOnce(
      entitiesRef
        .where("nameId", "==", nameId)
        .where("commandId", "==", currentCommand?.id)
        .where("isDeleted", "==", false),
    );

    const entityGu = entitiesGU.find(
      (entity) => entity?.nameId.toUpperCase() === nameId.toUpperCase(),
    );

    const _entityManager = entityGu?.managerId
      ? await fetchUser(entityGu.managerId)
      : {};

    return _entityManager;
  };

  const fetchDepartmentBoss = async (nameId) => {
    const departments = await fetchCollectionOnce(
      departmentsRef
        .where("nameId", "==", nameId)
        .where("commandId", "==", currentCommand?.id)
        .where("isDeleted", "==", false),
    );

    const department = departments.find(
      (_department) =>
        _department?.nameId.toUpperCase() === nameId.toUpperCase() &&
        _department.commandId === currentCommand.id,
    );

    const _departmentBoss = department?.bossId
      ? await fetchUser(department.bossId)
      : {};

    return _departmentBoss;
  };

  const fetchDepartmentBossSecond = async (nameId) => {
    const departments = await fetchCollectionOnce(
      departmentsRef
        .where("nameId", "==", nameId)
        .where("commandId", "==", currentCommand?.id)
        .where("isDeleted", "==", false),
    );

    const department = departments.find(
      (_department) =>
        _department?.nameId.toUpperCase() === nameId.toUpperCase() &&
        _department.commandId === currentCommand.id,
    );

    const _departmentBossSecond = department?.secondBossId
      ? await fetchUser(department.secondBossId)
      : {};

    return _departmentBossSecond;
  };

  return {
    fetchEntityManager,
    fetchDepartmentBoss,
    fetchDepartmentBossSecond,
  };
};
