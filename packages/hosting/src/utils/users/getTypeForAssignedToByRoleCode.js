import { AssignmentForUsers } from "../../data-list";

export const getTypeForAssignedToByRoleCode = (roleCode) => {
  const assignmentForUser = AssignmentForUsers?.[roleCode];

  if (!assignmentForUser) return null;

  return assignmentForUser;
};
