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
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  DasRequestModalProvider,
  useDasRequestModal,
  PersonalInformationModal,
  ObservationForInformationInstitutionModal,
} from "./components";
import { updateDasApplication } from "../../../../../../firebase/collections/dasApplications";

export const EditDasRequestIntegration = ({
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
  dasRequest,
  onGoBack,
  onConfirmApprovedDasRequest,
  onConfirmDesApprovedDasRequest,
  approvedLoading,
}) => {
  const { onShowDasRequestModal, onCloseDasRequestModal } =
    useDasRequestModal();

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

  const onObservationInstitutionData = () => {
    onShowDasRequestModal({
      title: "Agregar Observación",
      width: "50%",
      onRenderBody: () => (
        <ObservationForInformationInstitutionModal
          onCloseDasRequestModal={onCloseDasRequestModal}
        />
      ),
    });
  };

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
      children: <PersonalInformation dasRequest={dasRequest} />,
      extra: (
        <IconAction
          icon={faEdit}
          size={33}
          onClick={() => {
            console.log("OPEN");
            return onEditPersonalInformation(dasRequest);
          }}
        />
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
        <InstitutionInformation institution={dasRequest?.institution} />
      ),
      extra: (
        <div style={{ display: "flex" }}>
          <Button type="primary" onClick={onObservationInstitutionData}>
            Agregar Observación
          </Button>
          <IconAction icon={faEdit} size={33} onClick={() => console.log(2)} />
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
      children: <ApplicantInformation applicant={dasRequest?.applicant} />,
      extra: (
        <IconAction icon={faEdit} size={33} onClick={() => console.log(3)} />
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
