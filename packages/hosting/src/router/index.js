import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { PrivateRoute } from "./PrivateRoute";
import * as A from "../pages";
import { LoginIntegration, RegisterIntegration } from "../pages";
import { Page404 } from "../pages/404";

export const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LoginIntegration />} />
      <Route exact path="/register" element={<RegisterIntegration />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route
          exact
          path="users"
          element={
            <AdminLayout>
              <A.Users />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="users/:userId"
          element={
            <AdminLayout>
              <A.UserIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="home"
          element={
            <AdminLayout>
              <A.CorrespondencesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="correspondences"
          element={
            <AdminLayout>
              <A.CorrespondencesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="correspondences/:correspondenceId"
          element={
            <AdminLayout>
              <A.CorrespondenceIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="profile"
          element={
            <AdminLayout>
              <A.Profile />
            </AdminLayout>
          }
        />

        {/*<Route*/}
        {/*  exact*/}
        {/*  path="scripts"*/}
        {/*  element={*/}
        {/*    <AdminLayout>*/}
        {/*      <Scripts />*/}
        {/*    </AdminLayout>*/}
        {/*  }*/}
        {/*/>*/}
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
