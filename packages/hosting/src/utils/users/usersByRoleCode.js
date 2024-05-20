export const usersByRoleCode = (users = [], roleCodes = []) => {
  return users.filter((user) => roleCodes.includes(user.roleCode));
};
