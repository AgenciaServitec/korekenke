import { AssignmentForUsers } from "../data-list";

export const getTypeForAssignedToByRoleCode = (
  roleCode: string
): string | null => {
  const assignmentForUser = AssignmentForUsers.find((AssignmentForUser) =>
    AssignmentForUser.roles.includes(roleCode)
  );

  if (!assignmentForUser) return null;

  return assignmentForUser.type;
};
