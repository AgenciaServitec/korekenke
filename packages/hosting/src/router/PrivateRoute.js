import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PrivateRoute = () => {
  const { authUser } = useAuthentication();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return isLoginPage || authUser ? <Outlet /> : <Navigate to="/" />;
};

// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthentication } from "../providers";
// import { endsWith, isUndefined } from "lodash";
// import { useParams } from "react-router";
//
// export const PrivateRoute = () => {
//   const { authUser } = useAuthentication();
//   const location = useLocation();
//   const params = useParams();
//
//   const isLoginPage = location.pathname === "/";
//
//   const isEnabledAccess = () => {
//     const rules = {
//       isAuth: authUser,
//       isAuthorizedRoute: (authUser?.acls || []).find((aclRoute) =>
//           endsWith(pathnameTemplate(), aclRoute)
//       ),
//     };
//
//     return Object.values(rules).every((rule) => !!rule);
//   };
//
//   const pathnameTemplate = () => {
//     let pathnameTemplate = location.pathname;
//
//     console.log({ pathnameTemplate });
//
//     Object.entries(params).forEach(([key, value]) => {
//       if (!isUndefined(value) && value !== "new") {
//         pathnameTemplate = pathnameTemplate.replace(value, `:${key}`);
//       }
//     });
//
//     return pathnameTemplate;
//   };
//
//   return isLoginPage || isEnabledAccess() ? <Outlet /> : <Navigate to="/" />;
// };
