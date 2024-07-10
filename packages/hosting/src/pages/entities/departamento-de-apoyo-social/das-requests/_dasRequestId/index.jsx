import React, { useEffect, useState } from "react";
import { Acl, Col, notification, Row, Title } from "../../../../../components";
import { useDefaultFirestoreProps } from "../../../../../hooks";
import { useAuthentication } from "../../../../../providers";
import { useNavigate, useParams } from "react-router";
import {
  addDasApplication,
  fetchDasApplication,
  getDasApplicationId,
  updateDasApplication,
} from "../../../../../firebase/collections/dasApplications";
import styled from "styled-components";
import { Steps } from "antd";
import { Step1TypeRequest } from "./Step1TypeRequest";
import { Step2PersonalInformation } from "./Step2PersonalInformation";
import { Step3InstitutionInformation } from "./Step3InstitutionInformation";
import { Step4ApplicantDocuments } from "./Step4ApplicantDocuments";
import { Step5DataSummary } from "./Step5DataSummary";
import { Step6DasRequestSuccess } from "./Step6DasRequestSuccess";
import { EditDasRequestIntegration } from "./EditDasRequest";

export const DasRequestIntegration = () => {
  const navigate = useNavigate();
  const { dasRequestId } = useParams();
  const { authUser } = useAuthentication();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [dasRequest, setDasRequest] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const onNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const onPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const onGoToStep = (index) => setCurrentStep(index);

  const onGoToHome = () => navigate("/home");
  const onGoBack = () => navigate(-1);

  const isNew = dasRequestId === "new";

  useEffect(() => {
    isNew
      ? setDasRequest({ id: getDasApplicationId() })
      : (async () => {
          fetchDasApplication(dasRequestId).then((response) => {
            if (!response) return onGoBack();
            setDasRequest(response);
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
      to: formData?.isHeadline ? "headline" : "familiar",
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
    } catch (e) {
      console.error("ErrorSaveDasRequest: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DasRequest
      isNew={isNew}
      dasRequest={dasRequest}
      user={authUser}
      currentStep={currentStep}
      onNextStep={onNextStep}
      onPrevStep={onPrevStep}
      onGoToStep={onGoToStep}
      onGoToHome={onGoToHome}
      onGoBack={onGoBack}
      loading={loading}
      saveDasApplication={saveDasApplication}
    />
  );
};

const DasRequest = ({
  isNew,
  dasRequest,
  user,
  currentStep,
  onNextStep,
  onPrevStep,
  onGoToStep,
  onGoToHome,
  onGoBack,
  loading,
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
      title: "Resumen",
      description: "Paso 5",
    },
    {
      title: "Completado",
      description: "Paso 6",
    },
  ];

  const showStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1TypeRequest onNextStep={onNextStep} />;
      case 1:
        return (
          <Step2PersonalInformation
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            user={user}
          />
        );
      case 2:
        return (
          <Step3InstitutionInformation
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            user={user}
          />
        );
      case 3:
        return (
          <Step4ApplicantDocuments
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
          />
        );
      case 4:
        return (
          <Step5DataSummary
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            onGoToStep={onGoToStep}
            loading={loading}
            onSaveDasApplication={saveDasApplication}
          />
        );
      case 5:
        return (
          <Step6DasRequestSuccess
            onGoToHome={onGoToHome}
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
          />
        );
      default:
        return (
          <Step2PersonalInformation
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            user={user}
          />
        );
    }
  };

  return (
    <Acl
      category="departamento-de-apoyo-social"
      subCategory="dasRequests"
      name="/das-requests/new"
      redirect
    >
      <Container>
        <Row gutter={[16, 16]}>
          {isNew ? (
            <>
              <Col span={24}>
                <Title level={2} align="center">
                  Solicitud DAS
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
            </>
          ) : (
            <Col span={24}>
              <EditDasRequestIntegration
                dasRequest={dasRequest}
                onGoBack={onGoBack}
              />
            </Col>
          )}
        </Row>
      </Container>
    </Acl>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 70vh;

  .ant-steps-item-title {
    line-height: 1.3;
    font-size: 13px;
  }
  .ant-steps-item-description {
    font-size: 12px;
  }
`;
