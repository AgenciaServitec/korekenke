import React from "react";
import { PDF, Sheet } from "../../../../../components";
import { useParams } from "react-router";
import { DiscountAgreementGrantedUniversitySheet } from "./universities/DiscountAgreementGrantedUniversity";
import { DiscountAgreementPostgraduateStudiesUniversitySheet } from "./universities/DiscountAgreementPostgraduateStudiesUniversity";
import { StudyScholarshipAwardedByUniversitySheet } from "./universities/StudyScholarshipAwardedByUniversity";
import { StudyScholarshipPostgraduateStudiesUniversitySheet } from "./universities/StudyScholarshipPostgraduateStudiesUniversity";
import { HalfScholarshipAwardedByUniversitySheet } from "./universities/HalfScholarshipAwardedByUniversity";
import { HalfScholarshipPostgraduateStudiesUniversitySheet } from "./universities/HalfScholarshipPostgraduateStudiesUniversity";
import { DiscountAgreementGrantedInstituteSheet } from "./universities/DiscountAgreementGrantedInstitute";
import { InstituteStudyHalfScolarshipSheet } from "./universities/InstituteStudyHalfScolarship";
import { InstituteStudyScolarshipSheet } from "./universities/InstituteStudyScolarship";

export const DasRequestSheets = () => {
  const { dasRequestId } = useParams();

  const dasRequestContent = {
    universities: <DiscountAgreementGrantedUniversitySheet />,
    request2: <DiscountAgreementPostgraduateStudiesUniversitySheet />,
    request3: <StudyScholarshipAwardedByUniversitySheet />,
    request4: <StudyScholarshipPostgraduateStudiesUniversitySheet />,
    request5: <HalfScholarshipAwardedByUniversitySheet />,
    request6: <HalfScholarshipPostgraduateStudiesUniversitySheet />,
    request7: <DiscountAgreementGrantedInstituteSheet />,
    request8: <InstituteStudyHalfScolarshipSheet />,
    request9: <InstituteStudyScolarshipSheet />,
  };

  return (
    <PDF>
      <Sheet>{dasRequestContent[dasRequestId]}</Sheet>
    </PDF>
  );
};
