import {
  fetchDepartment,
  fetchEntity,
  fetchUnit,
  fetchUser,
} from "../../firebase/collections";

export const getAnimalEntitiesAndBosses = async (animal) => {
  if (!animal) return {};

  const _unit = await fetchUnit(animal?.unitId);
  if (!_unit) return {};

  const { entityId, departmentId } = _unit;

  const _department = departmentId ? await fetchDepartment(departmentId) : {};
  const _entity = entityId ? await fetchEntity(entityId) : {};

  const _entityManage = _entity?.entityManageId
    ? await fetchUser(_entity.entityManageId)
    : {};
  const __unitBoss = _unit?.bossId ? await fetchUser(_unit.bossId) : {};
  const _departmentBoss = _department?.bossId
    ? await fetchUser(_department.bossId)
    : {};

  return {
    entityGU: _entity || {},
    entityGUManage: _entityManage || {},
    department: _department || {},
    unit: _unit || {},
    departmentBoss: _departmentBoss || {},
    unitBoss: __unitBoss || {},
  };
};
