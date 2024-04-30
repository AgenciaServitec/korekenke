import { get, includes } from "lodash";

export const userInfo = (user) => ({
  urlsSuffixes: userUrlsSuffixes(user),
  initialUrlSuffix: userInitialUrlSuffix(user),
});

const userUrlsSuffixes = (user) => {
  const acls = get(user, "acls", {});

  return Object.values(acls)
    .flatMap((acl) => acl)
    .filter((aclName) => !aclName.includes("#"));
};

const userInitialUrlSuffix = (user) => {
  const urlsSuffixes = userUrlsSuffixes(user);

  const initialUrlSuffix = get(user, "role.initialUrlSuffix", "");

  return includes(urlsSuffixes, initialUrlSuffix)
    ? initialUrlSuffix
    : urlsSuffixes[0];
};
