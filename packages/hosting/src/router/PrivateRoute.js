import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthentication, useCommand } from "../providers";
import { endsWith, isEmpty, isUndefined } from "lodash";
import { useNavigate, useParams } from "react-router";
import { fetchEntityByNameId } from "../firebase/collections";

export const PrivateRoute = () => {
  const { authUser } = useAuthentication();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const { currentCommand } = useCommand();
  const { entityId } = useParams();

  const isLoginPage = location.pathname === "/";

  useEffect(() => {
    (async () => {
      if (!currentCommand && !entityId) return;

      const result = await validateAuthorizedModule();

      if (!result) return navigate("/home");
    })();
  }, [entityId]);

  const validateAuthorizedModule = async () => {
    const entity = entityId ? await fetchEntityByNameId(entityId) : null;

    if (isEmpty(entity)) return;

    return entity[0].commandId === currentCommand.id;
  };

  const validateAuthorizedRoute = () => {
    let result = false;

    Object.entries(authUser?.acls || {}).forEach(([key, subCategories = {}]) =>
      Object.entries(subCategories).forEach(([_key, values]) => {
        const response = values.find((aclRoute) =>
          endsWith(pathnameTemplate(), aclRoute)
        );

        if (!isEmpty(response)) {
          result = !isEmpty(response);
          return;
        }
      })
    );

    return result;
  };

  const isEnabledAccess = () => {
    const rules = {
      isAuth: authUser,
      isAuthorizedRoute: validateAuthorizedRoute(),
    };

    return Object.values(rules).every((rule) => !!rule);
  };

  const pathnameTemplate = () => {
    let pathnameTemplate = location.pathname;

    Object.entries(params).forEach(([key, value]) => {
      if (!isUndefined(value) && value !== "new") {
        pathnameTemplate = pathnameTemplate.replace(value, `:${key}`);
      }
    });

    return pathnameTemplate;
  };

  return isLoginPage || isEnabledAccess() ? <Outlet /> : <Navigate to="/" />;
};
