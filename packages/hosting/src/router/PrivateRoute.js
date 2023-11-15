import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PrivateRoute = () => {
  const { authUser } = useAuthentication();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return isLoginPage || authUser ? <Outlet /> : <Navigate to="/" />;
};
