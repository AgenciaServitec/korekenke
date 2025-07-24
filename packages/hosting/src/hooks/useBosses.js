import {
  departmentsRef,
  entitiesRef,
  fetchUser,
  officesRef,
  sectionsRef,
} from "../firebase/collections";
import { useCommand } from "../providers";
import { fetchCollectionOnce } from "../firebase/firestore";
import { firestore } from "../firebase";

export const useBosses = () => {
  const { currentCommand } = useCommand();

  const fetchDocById = async (collectionRef, docId) =>
    await firestore.collection(collectionRef).doc(docId);

  const fetchAssignedBoss = async (assignedTo) => {
    if (!assignedTo?.id || !assignedTo?.type) return null;

    let collectionRef;
    let fieldToUse;

    switch (assignedTo.type) {
      case "department":
        collectionRef = departmentsRef;
        fieldToUse = "bossId";
        break;
      case "entityGU":
        collectionRef = entitiesRef;
        fieldToUse = "managerId";
        break;
      case "section":
        collectionRef = sectionsRef;
        fieldToUse = "bossId";
        break;
      case "office":
        collectionRef = officesRef;
        fieldToUse = "bossId";
        break;
      default:
        return null;
    }

    const assignedDoc = await fetchDocById(collectionRef, assignedTo.id);

    if (!assignedDoc || !assignedDoc[fieldToUse]) return null;

    const bossOrManager = await fetchUser(assignedDoc[fieldToUse]);

    return bossOrManager || null;
  };

  const isUserAssignedResponsible = async (authUser) => {
    if (!authUser?.assignedTo.id) return false;

    const responsible = await fetchAssignedBoss(authUser.assignedTo);
    return responsible?.id === authUser.id;
  };

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
