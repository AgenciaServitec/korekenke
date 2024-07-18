import React, { useEffect } from "react";
import { notification, PDF, Sheet, Spinner } from "../../../../../components";
import { useParams } from "react-router";
import { DiscountAgreementGrantedUniversitySheet } from "./DiscountAgreementGrantedUniversity";
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
import { userFullName } from "../../../../../utils/users/userFullName2";
import { findRelationShip } from "../../../../../utils";
import { useGlobalData } from "../../../../../providers";
import { updateDasApplication } from "../../../../../firebase/collections/dasApplications";

export const DasRequestSheets = () => {
  const { requestType, dasRequestId } = useParams();
  const { users } = useGlobalData();

  // const [entityManage, setEntityManage] = useState(null);

  const [dasRequest = {} || null, dasRequestLoading, dasRequestError] =
    useDocumentData(firestore.collection("das-applications").doc(dasRequestId));

  useEffect(() => {
    dasRequestError && notification({ type: "error" });
  }, [dasRequestError]);

  useEffect(() => {
    if (dasRequest?.wasRead === false && dasRequest?.status === "pending") {
      (async () => {
        await updateDasApplication(dasRequestId, {
          status: "inProgress",
          wasRead: true,
        });
      })();
    }
  }, [dasRequest]);

  // useEffect(() => {
  //   (async () => {
  //     const _entities = await fetchEntities();
  //     console.log("_entities: ", _entities);
  //     const manageDas = _entities.find(
  //       (entity) => entity?.nameId === "departamento-de-apoyo-social"
  //     );
  //     const _entityManage = await fetchUser(manageDas?.entityManageId);
  //
  //     setEntityManage(_entityManage);
  //   })();
  // }, []);

  if (dasRequestLoading) return <Spinner height="80vh" />;

  const dataFamiliar = (familiar) => {
    const existCifInFamiliar = familiar?.cif ? `con CIF ${familiar?.cif}` : "";

    if (familiar)
      return `${findRelationShip(familiar)} ${userFullName(
        familiar
      )} ${existCifInFamiliar}`;

    return "persona";
  };

  const user = users.find((user) => user?.id === dasRequest?.headline?.id);

  const dasRequestView = {
    ...dasRequest,
    headline: {
      ...dasRequest.headline,
      ...user,
    },
  };

  const dasRequestContent = {
    descuento_por_convenio_en_universidad: (
      <>
        <Sheet>
          <DiscountAgreementGrantedUniversitySheet
            dasRequest={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    descuento_por_convenio_postgrado_en_universidad: (
      <>
        <Sheet>
          <DiscountAgreementPostgraduateStudiesUniversitySheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    beca_de_estudios_en_universidad: (
      <>
        <Sheet>
          <StudyScholarshipAwardedByUniversitySheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    beca_de_estudio_para_postgrado_en_universidad: (
      <>
        <Sheet>
          <StudyScholarshipPostgraduateStudiesUniversitySheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    media_beca_en_universidad: (
      <>
        <Sheet>
          <HalfScholarshipAwardedByUniversitySheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    media_beca_para_postgrado_en_universidad: (
      <>
        <Sheet>
          <HalfScholarshipPostgraduateStudiesUniversitySheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    descuento_por_convenio_en_instituto: (
      <>
        <Sheet>
          <DiscountAgreementGrantedInstituteSheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    beca_de_estudios_en_instituto: (
      <>
        <Sheet>
          <InstituteStudyScolarshipSheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
    media_beca_en_instituto: (
      <>
        <Sheet>
          <InstituteStudyHalfScolarshipSheet
            data={dasRequestView}
            dataFamiliar={dataFamiliar}
          />
        </Sheet>
        <ApplicantDocumentsSheet applicant={dasRequestView.applicant} />
      </>
    ),
  };

  return <PDF>{dasRequestContent?.[requestType]}</PDF>;
};
