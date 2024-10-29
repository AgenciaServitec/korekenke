import {
  fetchDepartments,
  fetchEntities,
  fetchUser,
} from "../firebase/collections";

export const fetchEntityManager = async (nameId) => {
  const entitiesGU = await fetchEntities();

  const entityGu = entitiesGU.find((entity) => entity?.nameId === nameId);

  const _entityManager = entityGu?.entityManageId
    ? await fetchUser(entityGu.entityManageId)
    : {};

  return _entityManager;
};

export const fetchDepartmentBoss = async (nameId) => {
  const departments = await fetchDepartments();

  const depatment = departments.find(
    (_depatment) => _depatment?.nameId === nameId,
  );

  const _departmentBoss = depatment?.bossId
    ? await fetchUser(depatment.bossId)
    : {};

  return _departmentBoss;
};
