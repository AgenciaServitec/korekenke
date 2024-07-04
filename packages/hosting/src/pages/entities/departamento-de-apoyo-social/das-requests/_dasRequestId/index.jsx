import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Title,
  Upload,
  notification,
} from "../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import { Relationships, institutions } from "../../../../../data-list";
import { useAuthentication } from "../../../../../providers";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router";
import {
  addDasApplication,
  fetchDasApplication,
  getDasApplicationId,
  updateDasApplication,
} from "../../../../../firebase/collections/dasApplications";
import styled from "styled-components";
import { Steps } from "antd";
import { TypeRequestStep1 } from "./typeRequestStep1";
import { PersonalInformationStep2 } from "./PersonalInformationStep2";
import { InstitutionInformation } from "./components/common/InstitutionInformation";
import { InstitutionInformationStep3 } from "./InstitutionInformationStep3";
import { ApplicantDocumentsStep4 } from "./ApplicantDocumentsStep4";

export const DasRequestIntegration = () => {
  const navigate = useNavigate();
  const { dasRequestId } = useParams();
  const { authUser } = useAuthentication();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [dasRequest, setDasRequest] = useState({});
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);

  const onNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const onPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onGoBack = () => navigate(-1);

  const isNew = dasRequestId === "new";

  useEffect(() => {
    isNew
      ? setDasRequest({ id: getDasApplicationId() })
      : (async () => {
          fetchDasApplication(dasRequestId).then((response) => {
            if (!response) return onGoBack();
            setDasRequest(response);
            setHeadline(response?.applicant?.to === "headline");
            return;
          });
        })();
  }, []);

  const mapForm = (formData) => ({
    ...dasRequest,
    requestType: formData.requestType,
    status: isNew ? "pending" : dasRequest.status,
    headline: {
      id: authUser.id,
      ...formData.headline,
      phone: {
        prefix: "+51",
        number: formData.headline.phoneNumber,
      },
    },
    familiar: formData?.familiar || null,
    institution: formData?.institution || null,
    applicant: {
      ...formData.applicant,
      to: headline ? "headline" : "familiar",
    },
  });

  const saveDasApplication = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addDasApplication(assignCreateProps(mapForm(formData)))
        : await updateDasApplication(
            dasRequest.id,
            assignUpdateProps(mapForm(formData))
          );

      notification({ type: "success" });
      onGoBack();
    } catch (e) {
      console.error("ErrorSaveDasRequest: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DasRequest
      user={authUser}
      currentStep={currentStep}
      onNextStep={onNextStep}
      onPrevStep={onPrevStep}
      saveDasApplication={saveDasApplication}
    />
  );
};

const DasRequest = ({
  user,
  currentStep,
  onNextStep,
  onPrevStep,
  saveDasApplication,
}) => {
  const stepsItems = [
    {
      title: "Tipo de solicitud",
      description: "Paso 1",
    },
    {
      title: "Datos Personales",
      description: "Paso 2",
    },
    {
      title: "Datos de Institucion",
      description: "Paso 3",
    },
    {
      title: "Documentos del Aplicante",
      description: "Paso 4",
    },
    {
      title: "Completado",
      description: "Paso 5",
    },
  ];

  const showStep = () => {
    switch (currentStep) {
      case 0:
        return <TypeRequestStep1 onNextStep={onNextStep} />;
      case 1:
        return (
          <PersonalInformationStep2
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            user={user}
          />
        );
      case 2:
        return (
          <InstitutionInformationStep3
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            user={user}
          />
        );
      case 3:
        return (
          <ApplicantDocumentsStep4
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
          />
        );
      case 4:
        return <div>Step 5</div>;
      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2} align="center">
            Solicitud para Instituciónes
          </Title>
        </Col>
        <Col span={24} md={20} style={{ margin: "auto" }}>
          <Steps
            labelPlacement="vertical"
            current={currentStep}
            items={stepsItems}
          />
          <br />
          <br />
        </Col>
        <Col span={24}>{showStep()}</Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .ant-steps-item-title {
    line-height: 1.3;
    font-size: 13px;
  }
  .ant-steps-item-description {
    font-size: 12px;
  }
`;
