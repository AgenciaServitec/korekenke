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

  const _department = await fetchDepartment(departmentId);
  const _entity = await fetchEntity(entityId);

  const _entityManage = await fetchUser(_entity.entityManageId);
  const __unitBoss = await fetchUser(_unit.bossId);
  const _departmentBoss = await fetchUser(_department.bossId);

  return {
    entityGU: _entity || {},
    entityGUManage: _entityManage || {},
    department: _department || {},
    unit: _unit || {},
    departmentBoss: _departmentBoss || {},
    unitBoss: __unitBoss || {},
  };
};
