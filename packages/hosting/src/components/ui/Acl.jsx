import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import assert from "assert";
import { useAuthentication } from "../../providers";
import { isEmpty } from "lodash";

export const Acl = ({ children, category, subCategory, name, redirect }) => {
  const navigate = useNavigate();

  const { authUser } = useAuthentication();

  assert(authUser, "Missing user");

  const [enabled, setEnabled] = useState(true);

  const navigateTo403 = () => {
    return navigate("/403");
  };

  const isValidateAclName = (name) => {
    if (isEmpty(category)) return false;
    if (isEmpty(subCategory)) return false;
    if (isEmpty(name)) return false;

    return (authUser?.acls?.[category]?.[subCategory] || []).some(
      (acl) => acl === name
    );
  };

  useMemo(() => {
    if (!name) return;

    const isValidateAcl = isValidateAclName(name);

    redirect && !isValidateAcl && navigateTo403();

    setEnabled(isValidateAcl);
  }, [authUser]);

  return enabled ? <>{children}</> : <></>;
};
