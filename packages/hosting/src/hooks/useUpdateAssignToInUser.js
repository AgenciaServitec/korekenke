import { concat } from "lodash";
import { updateUsersWithBatch } from "../firebase/collections";
import { useDefaultFirestoreProps } from "./useDefaultFirestoreProps";
import { getTypeForAssignedToByRoleCode } from "../utils";

export const useUpdateAssignToInUser = () => {
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const userMap = (user, moduleId = null) => ({
    id: user.id,
    assignedTo: {
      type:
        user?.assignedTo?.type || getTypeForAssignedToByRoleCode(user.roleCode),
      id: moduleId || null,
    },
  });

  //Get users by ids and return assignedTo data
  const getUsers = ({ usersIds = [], users = [], moduleId = null }) =>
    users
      .filter((user) => usersIds.includes(user.id))
      .map((user) => userMap(user, moduleId));

  const updateAssignToUser = async ({
    oldUsersIds = [],
    newUsersIds = [],
    moduleId = null, //departmentId | sectionId | officeId
    users = [], //departmentUsers | sectionUsers | officeUsers
  }) => {
    //Get old users by ids
    const oldUsers = getUsers({
      usersIds: oldUsersIds || [],
      users,
      moduleId: null,
    });

    //Get new users by ids
    const newUsers = getUsers({ usersIds: newUsersIds || [], users, moduleId });
    //Merge old users and new users
    const mergedUsers = concat(oldUsers, newUsers).map((user) =>
      assignUpdateProps(user),
    );

    //Update of both users
    await updateUsersWithBatch(mergedUsers);
  };

  return {
    updateAssignToUser,
  };
};
