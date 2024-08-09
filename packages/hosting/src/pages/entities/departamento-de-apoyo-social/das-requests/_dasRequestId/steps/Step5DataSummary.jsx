import React from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Collapse,
  IconAction,
  Row,
  Title,
} from "../../../../../../components";
import {
  getLocalStorage,
  removeFieldLocalStorage,
} from "../../../../../../utils";
import { mediaQuery } from "../../../../../../styles";
import {
  ApplicantInformation,
  InstitutionInformation,
  PersonalInformation,
  RequestType,
} from "./components";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export const Step5DataSummary = ({
  onPrevStep,
  onNextStep,
  onGoToStep,
  loading,
  onSaveDasApplication,
}) => {
  const dasRequest = getLocalStorage("dasRequest");

  const items = [
    {
      key: 1,
      label: (
        <Title level={5} style={{ margin: "0" }}>
          Tipo de solicitud
        </Title>
      ),
      children: <RequestType dasRequest={dasRequest} />,
      extra: (
        <IconAction icon={faEdit} size={33} onClick={() => onGoToStep(0)} />
      ),
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
        <IconAction icon={faEdit} size={33} onClick={() => onGoToStep(1)} />
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
        <IconAction icon={faEdit} size={33} onClick={() => onGoToStep(2)} />
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
        <IconAction icon={faEdit} size={33} onClick={() => onGoToStep(3)} />
      ),
    },
  ];

  const onSendDasRequest = () => {
    onSaveDasApplication({
      ...dasRequest,
      status: "waiting",
      wasRead: false,
    });
    removeFieldLocalStorage("dasRequest");
    onNextStep();
  };

  return (
    <Container>
      <div className="card-wrapper">
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>Resumen de solicitud</Title>
          </Col>
          <Col span={24}>
            <Collapse
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
              disabled={loading}
              onClick={onPrevStep}
            >
              Atras
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={onSendDasRequest}
            >
              Enviar mi solicitud
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
