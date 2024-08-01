import { useAuthentication } from "../providers";
import { includes, isArray, isEmpty } from "lodash";

export const useAcl = () => {
  const { authUser } = useAuthentication();

  const aclCheck = (category, subCategory, aclNames = []) => {
    if (isEmpty(category)) return false;
    if (isEmpty(subCategory)) return false;
    if (!isArray(aclNames)) return false;

    return authUser.acls?.[category]?.[subCategory].some((acl) =>
      includes(aclNames, acl)
    );
  };

  return { aclCheck };
};
