import {
  fetchDepartment,
  fetchEntity,
  fetchUnit,
  fetchUser,
} from "../../firebase/collections";

export const getAnimalEntitiesAndBosses = async (animal) => {
  console.log({ animal });

  if (!animal) return {};

  const _unit = await fetchUnit(animal?.unitId);
  if (!_unit) return {};

  const _department = await fetchDepartment(_unit.departmentId);
  const _entity = await fetchEntity(_department.entityId);
  const _entityManage = await fetchUser(_entity.entityManageId);
  const __unitBoss = await fetchUser(_unit.bossId);
  const _departmentBoss = await fetchUser(_department.bossId);

  return {
    entity: _entity,
    entityManage: _entityManage,
    department: _department,
    unit: _unit,
    departmentBoss: _departmentBoss,
    unitBoss: __unitBoss,
  };
};
