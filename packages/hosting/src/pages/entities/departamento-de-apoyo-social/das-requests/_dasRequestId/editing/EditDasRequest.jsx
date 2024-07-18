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

export const EditDasRequestIntegration = ({
  isNew,
  dasRequest,
  onGoBack,
  onNavigateTo,
}) => {
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [visibleReplyModal, onSetVisibleReplyModal] = useState(false);
  const [visibleReplyInformationModal, setVisibleReplyInformationModal] =
    useState(false);

  useEffect(() => {
    if (dasRequest?.wasRead === false && dasRequest?.status === "pending") {
      (async () => {
        await updateDasApplication(dasRequest.id, {
          status: "inProgress",
          wasRead: true,
        });
      })();
    }
  }, [dasRequest]);

  // const updateDasRequest = async (dasRequest, status) => {
  //   try {
  //     setApprovedLoading(true);
  //     await updateDasApplication(dasRequest.id, {
  //       status: status,
  //     });
  //
  //     notification({ type: "success" });
  //   } catch (e) {
  //     console.error("approvedDasRequestError:", e);
  //   } finally {
  //     setApprovedLoading(false);
  //   }
  // };

  // const onConfirmDesApprovedDasRequest = (dasRequest) =>
  //   modalConfirm({
  //     title: "¿Estás seguro de que quieres desaprobar la solicitud?",
  //     onOk: () => updateDasRequest(dasRequest, "pending"),
  //   });
  //
  // const onConfirmApprovedDasRequest = (dasRequest) => {
  //   const { headline, institution, applicant } = dasRequest;
  //
  //   if (
  //     !isEmpty(headline?.observations) ||
  //     !isEmpty(institution?.observations) ||
  //     !isEmpty(applicant?.observations)
  //   ) {
  //     return notification({
  //       type: "warning",
  //       title:
  //         "Para realizar la aprobacion, no debe hacer observaciones en la solicitud",
  //     });
  //   }
  //
  //   return modalConfirm({
  //     title: "¿Estás seguro de que quieres aprobar la solicitud?",
  //     onOk: () => updateDasRequest(dasRequest, "approved"),
  //   });
  // };

  if (isEmpty(dasRequest)) return <Spinner height="80vh" />;

  return (
    <DasRequestModalProvider>
      <EditDasRequest
        isNew={isNew}
        dasRequest={dasRequest}
        onGoBack={onGoBack}
        onNavigateTo={onNavigateTo}
        approvedLoading={approvedLoading}
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
  dasRequest,
  onGoBack,
  onNavigateTo,
  approvedLoading,
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
      title: "Observacion",
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
      title: "Agregar Observación",
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
                redirect
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
                redirect
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
                redirect
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

  return (
    <Container>
      <div className="card-wrapper">
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-wrapper">
              <Title level={2}>
                Solicitud: {findDasRequest(dasRequest?.requestType)?.name}
                &nbsp;
                <Tag
                  color={dasRequest.status === "pending" ? "orange" : "success"}
                >
                  {dasRequest.status === "pending" ? "Pendiente" : "Aprovado"}
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
            <Button
              size="large"
              block
              disabled={approvedLoading}
              onClick={() => onGoBack()}
            >
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
                  loading={approvedLoading}
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
