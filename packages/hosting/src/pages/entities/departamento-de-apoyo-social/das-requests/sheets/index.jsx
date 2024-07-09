import React, { useEffect } from "react";
import { notification, PDF, Sheet, Spinner } from "../../../../../components";
import { useParams } from "react-router";
import { DiscountAgreementGrantedUniversitySheet } from "./descuento-por-convenio-en-universidad";
import { DiscountAgreementPostgraduateStudiesUniversitySheet } from "./DiscountAgreementPostgraduateStudiesUniversity";
import { StudyScholarshipAwardedByUniversitySheet } from "./StudyScholarshipAwardedByUniversity";
import { StudyScholarshipPostgraduateStudiesUniversitySheet } from "./StudyScholarshipPostgraduateStudiesUniversity";
import { HalfScholarshipAwardedByUniversitySheet } from "./HalfScholarshipAwardedByUniversity";
import { HalfScholarshipPostgraduateStudiesUniversitySheet } from "./HalfScholarshipPostgraduateStudiesUniversity";
import { DiscountAgreementGrantedInstituteSheet } from "./DiscountAgreementGrantedInstitute";
import { InstituteStudyHalfScolarshipSheet } from "./InstituteStudyHalfScolarship";
import { InstituteStudyScolarshipSheet } from "./InstituteStudyScolarship";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../firebase";
import { ApplicantDocumentsSheet } from "./common/ApplicantDocumentsSheet";

export const DasRequestSheets = () => {
  const { requestType, dasRequestId } = useParams();

  const [dasRequest = {} || null, dasRequestLoading, dasRequestError] =
    useDocumentData(firestore.collection("das-applications").doc(dasRequestId));

  useEffect(() => {
    dasRequestError && notification({ type: "error" });
  }, [dasRequestError]);

  if (dasRequestLoading) return <Spinner height="80vh" />;

  const dasRequestContent = {
    descuento_por_convenio_en_universidad: (
      <>
        <Sheet>
          <DiscountAgreementGrantedUniversitySheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    descuento_por_convenio_postgrado_en_universidad: (
      <>
        <Sheet>
          <DiscountAgreementPostgraduateStudiesUniversitySheet
            data={dasRequest}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    beca_de_estudios_en_universidad: (
      <>
        <Sheet>
          <StudyScholarshipAwardedByUniversitySheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    beca_de_estudio_para_postgrado_en_universidad: (
      <>
        <Sheet>
          <StudyScholarshipPostgraduateStudiesUniversitySheet
            data={dasRequest}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    media_beca_en_universidad: (
      <>
        <Sheet>
          <HalfScholarshipAwardedByUniversitySheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    media_beca_para_postgrado_en_universidad: (
      <>
        <Sheet>
          <HalfScholarshipPostgraduateStudiesUniversitySheet
            data={dasRequest}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    descuento_por_convenio_en_instituto: (
      <>
        <Sheet>
          <DiscountAgreementGrantedInstituteSheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    beca_de_estudios_en_instituto: (
      <>
        <Sheet>
          <InstituteStudyScolarshipSheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
    media_beca_en_instituto: (
      <>
        <Sheet>
          <InstituteStudyHalfScolarshipSheet data={dasRequest} />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequest.applicant} />
      </>
    ),
  };

  return <PDF>{dasRequestContent[requestType]}</PDF>;
};
