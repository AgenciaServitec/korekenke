import { concat, flatMap, isEmpty, merge } from "lodash";
import { updateUser, updateUsersWithBatch } from "../firebase/collections";
import { useDefaultFirestoreProps } from "./useDefaultFirestoreProps";
import { useGlobalData } from "../providers";

export const useUpdateAssignToAndAclsOfUser = () => {
  const { assignUpdateProps } = useDefaultFirestoreProps();
  const { rolesAcls } = useGlobalData();

  const userMap = (user, moduleNameId, moduleId = null) => ({
    id: user.id,
    assignedTo: {
      type: moduleNameId,
      id: moduleId || null,
    },
  });

  //Get users by ids and return assignedTo data
  const getUsers = ({
    usersIds = [],
    users = [],
    moduleNameId = null,
    module = null,
  }) => {
    return users
      .filter((user) => usersIds.includes(user.id))
      .map((user) => userMap(user, moduleNameId, module?.id));
  };

  const updateAssignToAndAclsOfUser = async ({
    oldUsersIds = [],
    newUsersIds = [],
    moduleNameId = null,
    module = null, //departmentId | sectionId | officeId
    users = [],
    formData = undefined,
  }) => {
    //Get old users by ids
    const oldUsers = getUsers({
      usersIds: oldUsersIds || [],
      users,
      moduleNameId: null,
      module: null,
    });

    //Get new users by ids
    const newUsers = getUsers({
      usersIds: newUsersIds || [],
      users,
      moduleNameId,
      module,
    });

    //Merge old users and new users
    const mergedUsers = concat(oldUsers, newUsers).map((user) =>
      assignUpdateProps(user),
    );

    // UPDATED ACLS OF USERS
    const userAcls = rolesAcls.find((roleAcl) => roleAcl.id === "user")?.acls;
    const findModuleRole = (roleId) =>
      (module?.roles || []).find((role) => role.roleId === roleId);
    const findUser = (userId) => users.find((user) => user.id === userId);

    //UPDATE: DESELECTED USERS
    const oldUsersPromises = !isEmpty(oldUsers)
      ? oldUsers.map((user) =>
          updateUser(
            user.id,
            assignUpdateProps({
              roleCode: "user",
              acls: userAcls,
            }),
          ),
        )
      : undefined;

    // MEMBERS: Rol, Acls
    const membersPromises = !isEmpty(formData?.membersIds)
      ? formData.membersIds
          .filter(
            (memberId) =>
              ![formData.bossId, formData?.secondBossId].includes(memberId),
          )
          .map((memberId) =>
            updateUser(
              memberId,
              assignUpdateProps({
                roleCode: "user",
                acls: merge(
                  findUser(memberId)?.acls,
                  findModuleRole("member")?.acls,
                ),
              }),
            ),
          )
      : undefined;

    // MANAGER: Rol, Acls
    const managerPromises = formData?.managerId
      ? updateUser(
          formData.managerId,
          assignUpdateProps({
            roleCode: "manager",
            acls: merge(
              findUser(formData.managerId)?.acls,
              findModuleRole("manager")?.acls,
            ),
          }),
        )
      : undefined;

    // BOSS: Rol, Acls
    const bossPromises = formData?.bossId
      ? updateUser(
          formData.bossId,
          assignUpdateProps({
            roleCode: "user",
            acls: merge(
              findUser(formData.bossId)?.acls,
              findModuleRole("boss")?.acls,
            ),
          }),
        )
      : undefined;

    // SECOND BOSS: Rol, Acls
    const secondBossPromises = formData?.secondBossId
      ? updateUser(
          formData?.secondBossId,
          assignUpdateProps({
            roleCode: "user",
            acls: merge(
              findUser(formData.secondBossId)?.acls,
              findModuleRole("second_boss")?.acls,
            ),
          }),
        )
      : undefined;

    //Update of both users
    await updateUsersWithBatch(mergedUsers);

    await Promise.all(
      flatMap([
        membersPromises,
        oldUsersPromises,
        managerPromises,
        bossPromises,
        secondBossPromises,
      ]),
    );
  };

  return {
    updateAssignToAndAclsOfUser,
  };
};
