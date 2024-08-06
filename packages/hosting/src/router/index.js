import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { PrivateRoute } from "./PrivateRoute";
import * as A from "../pages";
import { Page404 } from "../pages/404";
import {
  PdfAnimalLogRegistrationCardSheet,
  PdfAnimalLogsRegistrationCardSheet,
} from "../pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animal-logs/sheets";

export const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<A.LoginIntegration />} />
      <Route exact path="/register" element={<A.RegisterIntegration />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route
          exact
          path="home"
          element={
            <AdminLayout>
              <A.HomeIntegration />
            </AdminLayout>
          }
        />
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
          path="units"
          element={
            <AdminLayout>
              <A.UnitsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="units/:unitId"
          element={
            <AdminLayout>
              <A.UnitIntegration />
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
        />
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
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals"
          element={
            <AdminLayout>
              <A.AnimalsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animal-logs"
          element={
            <AdminLayout>
              <A.AnimalLogsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId"
          element={
            <AdminLayout>
              <A.AnimalIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/animal-magazine-profiles"
          element={
            <AdminLayout>
              <A.AnimalMagazineProfilesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId"
          element={
            <AdminLayout>
              <A.AnimalMagazineProfileIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/clinic-history"
          element={
            <AdminLayout>
              <A.ClinicHistoryIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/departamento-de-apoyo-social/das-requests"
          element={
            <AdminLayout>
              <A.DasRequestsListIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/departamento-de-apoyo-social/das-requests/:dasRequestId"
          element={
            <AdminLayout>
              <A.DasRequestIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="surveys/organizational-climate-studies"
          element={
            <AdminLayout>
              <A.OrganizationalClimateStudiesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="surveys/organizational-climate-studies/:organizationalClimateStudyId"
          element={
            <AdminLayout>
              <A.OrganizationalClimateStudyIntegration />
            </AdminLayout>
          }
        />
      </Route>
      {/*SHEETS*/}
      <Route
        exact
        path="/correspondences/:correspondenceId/decree/sheets"
        element={<A.DecreeSheets />}
      />
      <Route
        exact
        path="/inscriptions/cmsts/sheet/:cmstsEnrollmentId"
        element={<A.InscriptionFile />}
      />
      <Route
        exact
        path="/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/pdf-animal-card"
        element={<A.PdfAnimalRegistrationCardSheet />}
      />
      <Route
        exact
        path="/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animal-logs/:animalId/pdf-animal-log-card"
        element={<A.PdfAnimalLogRegistrationCardSheet />}
      />
      <Route
        exact
        path="/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/clinic-history/pdf-clinic-history"
        element={<A.PdfClinicHistorySheets />}
      />
      <Route
        exact
        path="/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId/pdf-animal-magazine-profile"
        element={<A.PdfAnimalMagazineProfilesSheets />}
      />
      <Route
        exact
        path="/entities/departamento-de-apoyo-social/das-requests"
        element={
          <AdminLayout>
            <A.DasRequestsListIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/entities/departamento-de-apoyo-social/das-requests/:dasRequestId"
        element={
          <AdminLayout>
            <A.DasRequestIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/entities/departamento-de-apoyo-social/das-requests/:dasRequestId/:requestType/sheets"
        element={<A.DasRequestSheets />}
      />
      <Route
        exact
        path="/surveys/organizational-climate-studies/sheets"
        element={<A.OrganizationalClimateStudiesSheets />}
      />
      <Route exact path="/privacy-policies" element={<A.PrivacyPolicies />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
