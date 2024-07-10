import React, { useState } from "react";
import {
  Button,
  Col,
  Collapse,
  IconAction,
  Row,
  Title,
} from "../../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../../styles";
import {
  ApplicantInformation,
  InstitutionInformationForm,
  PersonalInformationForm,
  RequestType,
} from "../steps/components";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  DasRequestModalProvider,
  useDasRequestModal,
  PersonalInformationModal,
} from "./components";

export const EditDasRequestIntegration = ({
  dasRequest,
  onGoBack,
  onSaveDasApplication,
}) => {
  return (
    <DasRequestModalProvider>
      <EditDasRequest
        dasRequest={dasRequest}
        onGoBack={onGoBack}
        onSaveDasApplication={onSaveDasApplication}
      />
    </DasRequestModalProvider>
  );
};

const EditDasRequest = ({ dasRequest, onGoBack }) => {
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
      children: <PersonalInformationForm dasRequest={dasRequest} />,
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
        <InstitutionInformationForm institution={dasRequest?.institution} />
      ),
      extra: (
        <IconAction icon={faEdit} size={33} onClick={() => console.log(2)} />
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
              disabled={loadingUpload}
              onClick={() => onGoBack()}
            >
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              loading={loadingUpload}
              onClick={() => console.log("PROGRAMAR FUNCIONALIDAD")}
            >
              Aprobar solicitud
            </Button>
          </Col>
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
