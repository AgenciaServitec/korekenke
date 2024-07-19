import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  Collapse,
  IconAction,
  Row,
  Spinner,
  Tag,
  Title,
} from "../../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../../styles";
import {
  ApplicantInformation,
  InstitutionInformation,
  PersonalInformation,
  RequestType,
} from "../steps/components";
import { faEdit, faEye, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  ApplicantDocumentsModal,
  DasRequestModalProvider,
  InstitutionDataModal,
  ObservationForInstitucionalDataModal,
  ObservationPersonalInformationModal,
  PersonalInformationModal,
  useDasRequestModal,
} from "./components";
import { ObservationsList } from "./components/ObservationsList";
import { useDevice } from "../../../../../../hooks";
import { ObservationForApplicantDocumentsModal } from "./components/ObservationForApplicantDocumentsModal";
import { findDasRequest } from "../../../../../../utils";
import { isEmpty } from "lodash";
import { ReplyDasRequestModal } from "../../ReplyDasRequest";
import { ReplyDasRequestInformationModal } from "../../ReplyDasRequestInformation";
import { updateDasApplication } from "../../../../../../firebase/collections/dasApplications";
<<<<<<< HEAD
import { DasRequestStatus } from "../../../../../../data-list";
=======
>>>>>>> a79c382 (validate that the manager changes the status to inProcess of the request)
import {
  fetchEntities,
  fetchUser,
} from "../../../../../../firebase/collections";
import { useAuthentication } from "../../../../../../providers";

export const EditDasRequestIntegration = ({
  isNew,
  dasRequest,
  onGoBack,
  onNavigateTo,
}) => {
  const { authUser } = useAuthentication();
<<<<<<< HEAD
=======
  const [approvedLoading, setApprovedLoading] = useState(false);
>>>>>>> a79c382 (validate that the manager changes the status to inProcess of the request)
  const [visibleReplyModal, onSetVisibleReplyModal] = useState(false);
  const [visibleReplyInformationModal, setVisibleReplyInformationModal] =
    useState(false);

  useEffect(() => {
    (async () => {
<<<<<<< HEAD
      if (dasRequest?.status === "inProgress") return;

      const dasEntityManager = await fetchEntityManager();
      if (
        dasRequest?.wasRead === false &&
        dasRequest?.status === "proceeds" &&
        dasEntityManager?.id === authUser?.id
=======
      const dasEntityManager = await fetchEntityManager();
      if (
        dasRequest?.wasRead === false &&
        dasRequest?.status === "pending" &&
        dasEntityManager.id === authUser.id
>>>>>>> a79c382 (validate that the manager changes the status to inProcess of the request)
      ) {
        await updateDasApplication(dasRequest.id, {
          status: "inProgress",
          wasRead: true,
        });
      }
    })();
  }, [dasRequest]);

  const fetchEntityManager = async () => {
    const _entities = await fetchEntities();

    const manageDas = _entities.find(
<<<<<<< HEAD
      (entity) => entity?.nameId === "departamento-de-apoyo-social",
    );

    const _entityManager = manageDas?.entityManageId
      ? await fetchUser(manageDas?.entityManageId)
      : {};
=======
      (entity) => entity?.nameId === "departamento-de-apoyo-social"
    );
    const _entityManager = await fetchUser(manageDas?.entityManageId);
>>>>>>> a79c382 (validate that the manager changes the status to inProcess of the request)

    return _entityManager;
  };

  if (isEmpty(dasRequest)) return <Spinner height="80vh" />;

  return (
    <DasRequestModalProvider>
      <EditDasRequest
        isNew={isNew}
        user={authUser}
        dasRequest={dasRequest}
        onGoBack={onGoBack}
        onNavigateTo={onNavigateTo}
        visibleReplyModal={visibleReplyModal}
        onSetVisibleReplyModal={onSetVisibleReplyModal}
        visibleReplyInformationModal={visibleReplyInformationModal}
        setVisibleReplyInformationModal={setVisibleReplyInformationModal}
      />
    </DasRequestModalProvider>
  );
};

const EditDasRequest = ({
  isNew,
  user,
  dasRequest,
  onGoBack,
  onNavigateTo,
  visibleReplyModal,
  onSetVisibleReplyModal,
  visibleReplyInformationModal,
  setVisibleReplyInformationModal,
}) => {
  const { onShowDasRequestModal, onCloseDasRequestModal } =
    useDasRequestModal();
  const { isTablet } = useDevice();

  const onEditPersonalInformation = (dasRequest) => {
    onShowDasRequestModal({
      title: "Informacion personal",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <PersonalInformationModal
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const onObservationPersonalInformation = (dasRequest) => {
    onShowDasRequestModal({
<<<<<<< HEAD
      title: "Agregar Observacion",
=======
      title: "Observacion",
>>>>>>> ceceada (updated cif not required when is brother in editing modal and refactored the modal design)
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationPersonalInformationModal
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const onEditInstitutionData = (dasRequest) => {
    onShowDasRequestModal({
<<<<<<< HEAD
      title: "Datos de Institución",
=======
      title: "Agregar Observación",
>>>>>>> ceceada (updated cif not required when is brother in editing modal and refactored the modal design)
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <InstitutionDataModal
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const onObservationInstitutionData = (dasRequest) => {
    onShowDasRequestModal({
      title: "Agregar Observación",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationForInstitucionalDataModal
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const onEditApplicantDocuments = (dasRequest) => {
    onShowDasRequestModal({
      title: "Documentos",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ApplicantDocumentsModal
          isNew={isNew}
          user={user}
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const onObservationApplicantDocuments = (dasRequest) => {
    onShowDasRequestModal({
      title: "Agregar Observación",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationForApplicantDocumentsModal
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  const isPositiveOrApproved =
    dasRequest?.status === "approved" ||
    dasRequest?.response?.type === "positive";

  const items = [
    {
      key: 1,
      label: (
        <Title level={5} style={{ margin: "0" }}>
          Tipo de solicitud
        </Title>
      ),
      children: <RequestType dasRequest={dasRequest} />,
    },
    {
      key: 2,
      label: (
        <Title level={5} style={{ margin: "0" }}>
          Informacion personal
        </Title>
      ),
      children: (
        <>
          <PersonalInformation dasRequest={dasRequest} />
          <ObservationsList
            section="headline"
            observations={dasRequest?.headline?.observations}
            dasRequest={dasRequest}
          />
        </>
      ),
      extra: (
        <div style={{ display: "flex", gap: "0.5em" }}>
          {!isPositiveOrApproved && (
            <>
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#addObservation"
              >
                <IconAction
                  icon={faEye}
                  size={33}
                  onClick={() => onObservationPersonalInformation(dasRequest)}
                />
              </Acl>
              <IconAction
                icon={faEdit}
                size={33}
                onClick={() => onEditPersonalInformation(dasRequest)}
              />
            </>
          )}
        </div>
      ),
    },
    {
      key: 3,
      label: (
        <Title level={5} style={{ margin: "0" }}>
          Datos Institución
        </Title>
      ),
      children: (
        <>
          <InstitutionInformation institution={dasRequest?.institution} />
          <ObservationsList
            section="institution"
            observations={dasRequest?.institution?.observations}
            dasRequest={dasRequest}
          />
        </>
      ),
      extra: (
        <div style={{ display: "flex", gap: "0.5em" }}>
          {!isPositiveOrApproved && (
            <>
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#addObservation"
              >
                <IconAction
                  icon={faEye}
                  size={33}
                  onClick={() => onObservationInstitutionData(dasRequest)}
                />
              </Acl>
              <IconAction
                icon={faEdit}
                size={33}
                onClick={() => onEditInstitutionData(dasRequest)}
              />
            </>
          )}
        </div>
      ),
    },
    {
      key: 4,
      label: (
        <Title level={5} style={{ margin: "0" }}>
          Documentos de aplicante
        </Title>
      ),
      children: (
        <>
          <ApplicantInformation applicant={dasRequest?.applicant} />
          <ObservationsList
            section="applicant"
            observations={dasRequest?.applicant?.observations}
            dasRequest={dasRequest}
          />
        </>
      ),
      extra: (
        <div style={{ display: "flex", gap: "0.5em" }}>
          {!isPositiveOrApproved && (
            <>
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#addObservation"
              >
                <IconAction
                  icon={faEye}
                  size={33}
                  onClick={() => onObservationApplicantDocuments(dasRequest)}
                />
              </Acl>
              <IconAction
                icon={faEdit}
                size={33}
                onClick={() => onEditApplicantDocuments(dasRequest)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  console.log("Solicitud: ", dasRequest)

  return (
    <Container>
      <div className="card-wrapper">
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-wrapper">
              <Title level={2}>
                Solicitud: {findDasRequest(dasRequest?.requestType)?.name}
                &nbsp;
                <Tag color={DasRequestStatus?.[dasRequest.status]?.color}>
                  {DasRequestStatus?.[dasRequest.status]?.name}
                </Tag>
              </Title>
              <div className="actions-items">
                {dasRequest?.response && (
                  <div className="item">
                    <Tag
                      color={
                        dasRequest?.response?.type === "positive"
                          ? "green"
                          : "red"
                      }
                    >
                      {dasRequest?.response?.type === "positive"
                        ? "Positivo"
                        : "Negativo"}
                    </Tag>
                    <IconAction
                      tooltipTitle="Ver detalle de respuesta"
                      icon={faEye}
                      size={30}
                      styled={{ color: (theme) => theme.colors.info }}
                      onClick={() => setVisibleReplyInformationModal(true)}
                    />
                  </div>
                )}
                <Acl
                  category="departamento-de-apoyo-social"
                  subCategory="dasRequests"
                  name="/das-requests/:dasRequestId/sheets"
                >
                  <IconAction
                    tooltipTitle="PDF"
                    icon={faFilePdf}
                    styled={{ color: (theme) => theme.colors.error }}
                    onClick={() =>
                      onNavigateTo(`${dasRequest.requestType}/sheets`)
                    }
                  />
                </Acl>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <Collapse
              collapsible="icon"
              defaultActiveKey={[1, 2, 3, 4]}
              expandIconPosition="start"
              items={items}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button size="large" block onClick={() => onGoBack()}>
              Cancelar
            </Button>
          </Col>
          <Acl
            category="departamento-de-apoyo-social"
            subCategory="dasRequests"
            name="/das-requests/:dasRequestId#reply"
          >
            {!isPositiveOrApproved && (
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  disabled={dasRequest.status === "approved"}
                  onClick={() => onSetVisibleReplyModal(dasRequest)}
                >
                  Responder solicitud
                </Button>
              </Col>
            )}
          </Acl>
          <ReplyDasRequestInformationModal
            visibleModal={visibleReplyInformationModal}
            onSetVisibleModal={setVisibleReplyInformationModal}
            response={dasRequest?.response}
          />
          <ReplyDasRequestModal
            visibleModal={visibleReplyModal}
            onSetVisibleModal={onSetVisibleReplyModal}
            dasRequest={dasRequest}
          />
        </Row>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .card-wrapper {
    width: 100%;
    margin: auto;
    ${mediaQuery.minDesktop} {
      width: 70%;
    }

    .header-wrapper {
      display: flex;
      justify-content: space-between;
      gap: 1em;
      flex-wrap: wrap;
      .actions-items {
        display: flex;
        align-items: center;
        gap: 0.7em;
        .item {
          display: flex;
          align-items: center;
        }
      }
    }

    .ant-collapse-header {
      align-items: center;
    }

    .wrapper-item {
      display: flex;
      flex-direction: column;
      .label {
        font-size: 0.86em;
      }
      .value {
        font-weight: 600;
        font-size: 1em;
      }
    }
  }
`;
