import React, { useEffect, useState } from "react";
import { Acl, Col, notification, Row, Title } from "../../../../../components";
import { useDefaultFirestoreProps } from "../../../../../hooks";
import { useAuthentication } from "../../../../../providers";
import { useNavigate, useParams } from "react-router";
import {
  addDasApplication,
  getDasApplicationId,
  updateDasApplication,
} from "../../../../../firebase/collections/dasApplications";
import styled from "styled-components";
import { Steps } from "antd";
import { Step1TypeRequest } from "./steps/Step1TypeRequest";
import { Step2PersonalInformation } from "./steps/Step2PersonalInformation";
import { Step3InstitutionInformation } from "./steps/Step3InstitutionInformation";
import { Step4ApplicantDocuments } from "./steps/Step4ApplicantDocuments";
import { Step5DataSummary } from "./steps/Step5DataSummary";
import { Step6DasRequestSuccess } from "./steps/Step6DasRequestSuccess";
import { EditDasRequestIntegration } from "./editing/EditDasRequest";
import { omit } from "lodash";
import { firestore } from "../../../../../firebase";
import { setLocalStorage } from "../../../../../utils";
import dayjs from "dayjs";

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

  const onNavigateTo = (pathname) => navigate(pathname);
  const onGoToHome = () => navigate("/home");
  const onGoBack = () => navigate(-1);

  const isNew = dasRequestId === "new";

  useEffect(() => {
    if (isNew) {
      const dasApplicationId = getDasApplicationId();

      setLocalStorage("dasRequest", { id: dasApplicationId });
      setDasRequest({ id: dasApplicationId });
    } else {
      (async () => {
        await firestore
          .collection("das-applications")
          .doc(dasRequestId)
          .onSnapshot((snapshot) => setDasRequest(snapshot.data()));
      })();
    }
  }, []);

  const mapForm = (formData) => ({
    ...dasRequest,
    isHeadline: formData.isHeadline,
    requestType: formData.requestType,
    status: isNew ? "waiting" : dasRequest.status,
    wasRead: dasRequest?.wasRead || false,
    headline: {
      id: authUser.id,
      ...omit(formData.headline, "phoneNumber"),
      phone: {
        prefix: "+51",
        number: formData?.headline?.phoneNumber,
      },
    },
    familiar: formData?.familiar || null,
    institution: formData?.institution || null,
    applicant: {
      ...formData.applicant,
      to: formData?.isHeadline ? "headline" : "familiar",
    },
    userId: authUser.id,
    createAtString: dayjs().format("DD-MM-YYYY"),
  });

  const saveDasApplication = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addDasApplication(assignCreateProps(mapForm(formData)))
        : await updateDasApplication(
            dasRequest.id,
            assignUpdateProps(formData),
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
      onNavigateTo={onNavigateTo}
      loading={loading}
      onSaveDasApplication={saveDasApplication}
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
  onNavigateTo,
  loading,
  onSaveDasApplication,
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
            isNew={isNew}
            user={user}
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
            onSaveDasApplication={onSaveDasApplication}
          />
        );
      case 5:
        return (
          <Step6DasRequestSuccess
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
            onGoToHome={onGoToHome}
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
      category="public"
      subCategory="dasRequests"
      name={isNew ? "/das-requests/new" : "/das-requests/:dasRequestId"}
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
                isNew={isNew}
                dasRequest={dasRequest}
                onGoBack={onGoBack}
                onNavigateTo={onNavigateTo}
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
