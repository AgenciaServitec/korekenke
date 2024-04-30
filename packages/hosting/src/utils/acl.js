import { acls } from "../data-list";
import { includes } from "lodash";

export const filterAcl = (filter, except = []) =>
  Object.fromEntries(
    Object.entries(acls)
      .filter(([acl]) => acl.split("#")[0].split("/")[1] === filter)
      .filter(([acl]) => (except ? !includes(except, acl) : true))
  );

export const filterAclExact = (filter) =>
  Object.fromEntries(Object.entries(acls).filter(([acl]) => acl === filter));

export const mapAcls = (acls = []) => ({
  home: filterMapAcl(acls, "home"),
  defaultRolesAcls: filterMapAcl(acls, "default-roles-acls"),
  manageAcls: filterMapAcl(acls, "manage-acls"),
  profile: filterMapAcl(acls, "profile"),
  users: [...filterMapAcl(acls, "users")],
  correspondences: [...filterMapAcl(acls, "correspondences")],
  inscriptions: [...filterMapAcl(acls, "inscriptions")],
});

const filterMapAcl = (acls = [], filter, except = []) =>
  acls
    .filter((acl) => acl.split("#")[0].split("/")[1] === filter)
    .filter((acl) => (except ? !includes(except, acl) : true));

const filterMapAclExact = (acls = [], filter) =>
  acls.filter((acl) => acl === filter);
