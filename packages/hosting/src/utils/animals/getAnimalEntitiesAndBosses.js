import {
  fetchDepartment,
  fetchEntity,
  fetchUnit,
  fetchUser,
} from "../../firebase/collections";

export const getAnimalEntitiesAndBosses = async (animal) => {
  if (!animal) return {};

  const unit = await fetchUnit(animal?.unitId);
  if (!unit) return {};

  const { entityId, departmentId } = unit;

  const p0 = departmentId ? fetchDepartment(departmentId) : {};
  const p1 = entityId ? fetchEntity(entityId) : {};

  const [department, entityGU] = await Promise.all([p0, p1]);

  const p2 = entityGU.managerId ? fetchUser(entityGU.managerId) : {};
  const p3 = unit.bossId ? fetchUser(unit.bossId) : {};
  const p4 = department.bossId ? fetchUser(department.bossId) : {};

  const [entityGUManage, unitBoss, departmentBoss] = await Promise.all([
    p2,
    p3,
    p4,
  ]);

  return {
    entityGU: entityGU || {},
    entityGUManage: entityGUManage || {},
    unit: unit || {},
    unitBoss: unitBoss || {},
    department: department || {},
    departmentBoss: departmentBoss || {},
  };
};
