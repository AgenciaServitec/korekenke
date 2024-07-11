import React, { useState } from "react";
import {
  Acl,
  Button,
  Col,
  Collapse,
  IconAction,
  modalConfirm,
  notification,
  Row,
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
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  ApplicantDocumentsModal,
  DasRequestModalProvider,
  InstitutionDataModal,
  ObservationForInstitucionalDataModal,
  ObservationPersonalInformationModal,
  PersonalInformationModal,
  useDasRequestModal,
} from "./components";
import { updateDasApplication } from "../../../../../../firebase/collections/dasApplications";
import { ObservationsList } from "./components/ObservationsList";
import { useDevice } from "../../../../../../hooks";

export const EditDasRequestIntegration = ({
  isNew,
  dasRequest,
  onGoBack,
  onSaveDasApplication,
}) => {
  const [approvedLoading, setApprovedLoading] = useState(false);

  const updateDasRequest = async (dasRequest, status) => {
    try {
      setApprovedLoading(true);
      await updateDasApplication(dasRequest.id, {
        status: status,
      });

      notification({ type: "success" });
    } catch (e) {
      console.error("approvedDasRequestError:", e);
    } finally {
      setApprovedLoading(false);
    }
  };

  const onConfirmDesApprovedDasRequest = (dasRequest) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres desaprobar la solicitud?",
      onOk: () => updateDasRequest(dasRequest, "pending"),
    });

  const onConfirmApprovedDasRequest = (dasRequest) => {
    const { headline, institution, applicant } = dasRequest;

    if (
      [
        headline?.observation?.status,
        institution?.observation?.status,
        applicant?.observation?.status,
      ].includes("pending")
    ) {
      return notification({
        type: "warning",
        title:
          "Para realizar la aprobacion, no debe hacer observaciones en la solictud",
      });
    }

    return modalConfirm({
      title: "¿Estás seguro de que quieres aprobar la solicitud?",
      onOk: () => updateDasRequest(dasRequest, "approved"),
    });
  };

  return (
    <DasRequestModalProvider>
      <EditDasRequest
        isNew={isNew}
        dasRequest={dasRequest}
        onGoBack={onGoBack}
        onSaveDasApplication={onSaveDasApplication}
        onConfirmApprovedDasRequest={onConfirmApprovedDasRequest}
        onConfirmDesApprovedDasRequest={onConfirmDesApprovedDasRequest}
        approvedLoading={approvedLoading}
      />
    </DasRequestModalProvider>
  );
};

const EditDasRequest = ({
  isNew,
  dasRequest,
  onGoBack,
  onConfirmApprovedDasRequest,
  onConfirmDesApprovedDasRequest,
  approvedLoading,
}) => {
  const { onShowDasRequestModal, onCloseDasRequestModal } =
    useDasRequestModal();
  const { isMobile } = useDevice();

  const [loadingUpload, setLoadingUpload] = useState(false);

  const onEditPersonalInformation = (dasRequest) => {
    onShowDasRequestModal({
      title: "Informacion personal",
      width: "50%",
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
      width: "50%",
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
      width: "50%",
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
      width: `${isMobile ? "80%" : "50%"}`,
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
      width: `${isMobile ? "80%" : "50%"}`,
      onRenderBody: () => (
        <ApplicantDocumentsModal
          isNew={isNew}
          dasRequest={dasRequest}
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

  console.log({ dasRequest });

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
          <IconAction
            icon={faEye}
            size={33}
            onClick={() => onObservationPersonalInformation(dasRequest)}
          />
          <IconAction
            icon={faEdit}
            size={33}
            onClick={() => onEditPersonalInformation(dasRequest)}
          />
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
          <IconAction
            icon={faEye}
            size={33}
            onClick={() => onObservationInstitutionData(dasRequest)}
          />
          <IconAction
            icon={faEdit}
            size={33}
            onClick={() => onEditInstitutionData(dasRequest)}
          />
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
          {/*<IconAction*/}
          {/*  icon={faEye}*/}
          {/*  size={33}*/}
          {/*  onClick={() => onObservationInstitutionData(dasRequest)}*/}
          {/*/>*/}
          <IconAction
            icon={faEdit}
            size={33}
            onClick={() => onEditApplicantDocuments(dasRequest)}
          />
        </div>
      ),
    },
  ];
  return (
    <Container>
      <div className="card-wrapper">
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>Solicitud DAS</Title>
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
              type="primary"
              size="large"
              block
              disabled={loadingUpload || approvedLoading}
              onClick={() => onGoBack()}
            >
              Cancelar
            </Button>
          </Col>
          {dasRequest?.status === "approved" && (
            <Col xs={24} sm={12} md={6}>
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#noApproved"
              >
                <Button
                  danger
                  size="large"
                  block
                  loading={loadingUpload || approvedLoading}
                  disabled={
                    !![
                      dasRequest.headline?.observation?.status,
                      dasRequest.institution?.observation?.status,
                      dasRequest.applicant?.observation?.status,
                    ].includes("approved")
                  }
                  onClick={() => onConfirmDesApprovedDasRequest(dasRequest)}
                >
                  Desaprobar solicitud
                </Button>
              </Acl>
            </Col>
          )}
          {dasRequest?.status === "pending" && (
            <Col xs={24} sm={12} md={6}>
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#approved"
              >
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loadingUpload || approvedLoading}
                  disabled={
                    !![
                      dasRequest.headline?.observation?.status,
                      dasRequest.institution?.observation?.status,
                      dasRequest.applicant?.observation?.status,
                    ].includes("pending")
                  }
                  onClick={() => onConfirmApprovedDasRequest(dasRequest)}
                >
                  Aprobar solicitud
                </Button>
              </Acl>
            </Col>
          )}
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
