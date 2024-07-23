import React, { useEffect, useState } from "react";
import { notification, PDF, Sheet, Spinner } from "../../../../../components";
import { useParams } from "react-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../firebase";
import { ApplicantDocumentsSheet } from "./common/ApplicantDocumentsSheet";
import { userFullName } from "../../../../../utils/users/userFullName2";
import { findRelationShip } from "../../../../../utils";
import { useAuthentication, useGlobalData } from "../../../../../providers";
import { updateDasApplication } from "../../../../../firebase/collections/dasApplications";
import { fetchEntities, fetchUser } from "../../../../../firebase/collections";
import { DescuentoConvenioUniversidadSheet } from "./DescuentoConvenioUniversidad.Sheet";
import { BecaEstudioPostgradoUniversidadSheet } from "./BecaEstudioPostgradoUniversidad.Sheet";
import { DescuentoConvenioPostgradoUniversidadSheet } from "./DescuentoConvenioPostgradoUniversidad.Sheet";
import { BecaEstudiosUniversidadSheet } from "./BecaEstudiosUniversidad.Sheet";
import { MediaBecaUniversidadSheet } from "./MediaBecaUniversidad.Sheet";
import { MediaBecaPostgradoUniversidadSheet } from "./MediaBecaPostgradoUniversidad.Sheet";
import { DescuentoConvenioInstitutoSheet } from "./DescuentoConvenioInstituto.Sheet";
import { BecaEstudiosInstitutoSheet } from "./BecaEstudiosInstituto.Sheet";
import { MediaBecaInstitutoSheet } from "./MediaBecaInstituto.Sheet";

export const DasRequestSheets = () => {
  const { requestType, dasRequestId } = useParams();
  const { users } = useGlobalData();
  const { authUser } = useAuthentication();

  const [entityManager, setEntityManager] = useState(null);

  const [dasRequest = {} || null, dasRequestLoading, dasRequestError] =
    useDocumentData(firestore.collection("das-applications").doc(dasRequestId));

  useEffect(() => {
    dasRequestError && notification({ type: "error" });
  }, [dasRequestError]);

  useEffect(() => {
    (async () => {
      const dasEntityManager = await fetchEntityManager();
      if (
        dasRequest?.wasRead === false &&
        dasRequest?.status === "pending" &&
        dasEntityManager.id === authUser.id
      ) {
        await updateDasApplication(dasRequestId, {
          status: "inProgress",
          wasRead: true,
        });
      }
    })();
  }, [dasRequest]);

  const fetchEntityManager = async () => {
    const _entities = await fetchEntities();

    const manageDas = _entities.find(
      (entity) => entity?.nameId === "departamento-de-apoyo-social"
    );
    const _entityManager = await fetchUser(manageDas?.entityManageId);

    setEntityManager(_entityManager);
    return _entityManager;
  };

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
          <DescuentoConvenioUniversidadSheet
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
          <DescuentoConvenioPostgradoUniversidadSheet
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
          <BecaEstudiosUniversidadSheet
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
          <BecaEstudioPostgradoUniversidadSheet
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
          <MediaBecaUniversidadSheet
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
          <MediaBecaPostgradoUniversidadSheet
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
          <DescuentoConvenioInstitutoSheet
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
          <BecaEstudiosInstitutoSheet
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
          <MediaBecaInstitutoSheet
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
