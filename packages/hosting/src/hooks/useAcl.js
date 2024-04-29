import { useAuthentication } from "../providers";

export const useAcl = () => {
  const { authUser } = useAuthentication();

  const aclCheck = (acl) =>
    authUser?.acls.some((userAcl) => userAcl === acl) || false;

  return { aclCheck };
};
