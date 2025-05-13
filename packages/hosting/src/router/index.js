import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout, PublicLayout } from "../components/layout";
import { PrivateRoute } from "./PrivateRoute";
import * as A from "../pages";
import { Page404 } from "../pages/404";
import { RafflePlay } from "../pages";

export const Router = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<A.LoginIntegration />} />
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
          path="entities-gu"
          element={
            <AdminLayout>
              <A.EntitiesGUIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities-gu/:entityGUId"
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
          path="my-agenda"
          element={
            <AdminLayout>
              <A.Activities />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="assistances"
          element={
            <AdminLayout>
              <A.AssistancesIntegration />
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
          path="entities/:entityId/animals"
          element={
            <AdminLayout>
              <A.AnimalsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animal-logs"
          element={
            <AdminLayout>
              <A.AnimalLogsIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animals/:animalId"
          element={
            <AdminLayout>
              <A.AnimalIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animals/:animalId/animal-magazine-profiles"
          element={
            <AdminLayout>
              <A.AnimalMagazineProfilesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId"
          element={
            <AdminLayout>
              <A.AnimalMagazineProfileIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animals/:animalId/clinic-history"
          element={
            <AdminLayout>
              <A.ClinicHistoryIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="entities/:entityId/animals/:animalId/family-tree"
          element={
            <AdminLayout>
              <A.FamilyTreeIntegration />
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
          path="raffles"
          element={
            <AdminLayout>
              <A.RafflesIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="raffles/:raffleId"
          element={
            <AdminLayout>
              <A.RaffleIntegration />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="raffles/:raffleId/participants"
          element={
            <AdminLayout>
              <A.RafflesParticipants />
            </AdminLayout>
          }
        />
        <Route
          exact
          path="raffles/:raffleId/play"
          element={
            <AdminLayout>
              <A.RafflePlay />
            </AdminLayout>
          }
        />
      </Route>
      <Route exact path="profile/documents/lpt" element={<A.PdfLptSheets />} />
      <Route
        exact
        path="assistances/assistance"
        element={
          <PublicLayout>
            <A.AssistanceIntegration />
          </PublicLayout>
        }
      />
      <Route
        exact
        path="surveys/organizational-climate-studies/:organizationalClimateStudyId"
        element={
          <PublicLayout>
            <A.OrganizationalClimateStudyIntegration />
          </PublicLayout>
        }
      />
      {/*SHEETS*/}
      <Route
        exact
        path="entities/:entityId/das-requests"
        element={
          <AdminLayout>
            <A.DasRequestsListIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="entities/:entityId/das-requests/:dasRequestId"
        element={
          <AdminLayout>
            <A.DasRequestIntegration />
          </AdminLayout>
        }
      />
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
        path="/entities/:entityId/animals/:animalId/pdf-animal-card"
        element={<A.PdfAnimalRegistrationCardSheet />}
      />
      <Route
        exact
        path="/entities/:entityId/animal-logs/:animalId/pdf-animal-log-card"
        element={<A.PdfAnimalLogRegistrationCardSheet />}
      />
      <Route
        exact
        path="/entities/:entityId/animals/:animalId/clinic-history/pdf-clinic-history"
        element={<A.PdfClinicHistorySheets />}
      />
      <Route
        exact
        path="/entities/:entityId/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId/pdf-animal-magazine-profile"
        element={<A.PdfAnimalMagazineProfilesSheets />}
      />
      <Route
        exact
        path="/entities/:entityId/das-requests"
        element={
          <AdminLayout>
            <A.DasRequestsListIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/entities/:entityId/das-requests/:dasRequestId"
        element={
          <AdminLayout>
            <A.DasRequestIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/military-service-recruitment"
        element={
          <AdminLayout>
            <A.MilitaryRecruitmentServicesIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/military-service-recruitment/:militaryServiceRecruitmentId"
        element={
          <PublicLayout>
            <A.MilitaryRecruitmentServiceIntegration />
          </PublicLayout>
        }
      />
      <Route
        exact
        path="/holidays-request"
        element={
          <AdminLayout>
            <A.HolidaysRequestIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/holidays-request/:holidayRequestId"
        element={
          <AdminLayout>
            <A.HolidayRequestIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/holidays-request/:holidayId/sheets/:userId"
        element={<A.HolidaysSheets />}
      />
      <Route
        exact
        path="/elections"
        element={
          <AdminLayout>
            <A.Election />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/elections/:electionId"
        element={
          <AdminLayout>
            <A.ElectionsIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/elections/add-candidate/:electionId"
        element={
          <AdminLayout>
            <A.AddCandidates />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/elections/submit-vote/:electionId"
        element={
          <AdminLayout>
            <A.VotingBooth />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/visits"
        element={
          <AdminLayout>
            <A.Visits />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/visits/:visitId"
        element={
          <AdminLayout>
            <A.VisitsIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/tutorials/:tutorialId"
        element={
          <AdminLayout>
            <A.TutorialIntegration />
          </AdminLayout>
        }
      />
      <Route
        exact
        path="/entities/:entityId/das-requests/:dasRequestId/:requestType/sheets"
        element={<A.DasRequestSheets />}
      />
      <Route
        exact
        path="/surveys/organizational-climate-studies/sheets"
        element={<A.OrganizationalClimateStudiesSheets />}
      />
      <Route exact path="/privacy-policies" element={<A.PrivacyPolicies />} />
      <Route exact path="/support" element={<A.Support />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
