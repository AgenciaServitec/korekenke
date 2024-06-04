import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { PrivateRoute } from "./PrivateRoute";
import * as A from "../pages";
import { Page404 } from "../pages/404";
import { EquineMagazineProfileIntegration } from "../pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/equine-magazine-profiles/_equineMagazineProfileId";

export const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<A.LoginIntegration />} />
      <Route exact path="/register" element={<A.RegisterIntegration />} />
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
          path="default-roles-acls"
          element={
            <AdminLayout>
              <A.DefaultRolesAclsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="default-roles-acls/:roleAclsId"
          element={
            <AdminLayout>
              <A.RoleAclIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="manage-acls"
          element={
            <AdminLayout>
              <A.ManageAclsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities"
          element={
            <AdminLayout>
              <A.EntitiesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId"
          element={
            <AdminLayout>
              <A.EntityIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="departments"
          element={
            <AdminLayout>
              <A.DepartmentsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="departments/:departmentId"
          element={
            <AdminLayout>
              <A.DepartmentIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="sections"
          element={
            <AdminLayout>
              <A.SectionsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="sections/:sectionId"
          element={
            <AdminLayout>
              <A.SectionIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="offices"
          element={
            <AdminLayout>
              <A.OfficesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="offices/:officeId"
          element={
            <AdminLayout>
              <A.OfficeIntegration />
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
        />{" "}
        <Route
          exact
          path="inscriptions/cmsts"
          element={
            <AdminLayout>
              <A.CmstsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="inscriptions/cmsts/all"
          element={
            <AdminLayout>
              <A.AllRegistered />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="inscriptions/cmsts/sheet"
          element={<A.InscriptionFile />}
        />
      </Route>
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines"
        element={
          <AdminLayout>
            <A.LiveStockAndEquinesIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId"
        element={
          <AdminLayout>
            <A.LiveStockAndEquineIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId/clinic-history"
        element={
          <AdminLayout>
            <A.ClinicHistoryIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId/clinic-history/sheets"
        element={<A.Sheets />}
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId/equine-magazine-profiles"
        element={
          <AdminLayout>
            <A.EquineMagazineProfilesIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId/equine-magazine-profiles/:equineMagazineProfileId"
        element={
          <AdminLayout>
            <A.EquineMagazineProfileIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/:livestockOrEquineId/equine-magazine-profiles/sheets"
        element={<A.SheetsEquineMagazineProfiles />}
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
