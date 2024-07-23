import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { Steps } from "../../components";
import { mediaQuery } from "../../styles";
import { AccessData } from "./AccessData";
import { PersonalInformation } from "./PersonalInformation";
import { PrivacyPolicies } from "./PrivacyPolicies";
import { useAuthentication } from "../../providers";
import { MilitarSchool } from "../../images";

export const RegisterIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const [currentStep, setCurrentStep] = useState(0);

  const onNavigateTo = (url) => navigate(url);

  useEffect(() => {
    authUser && onNavigateTo("/home");
  }, [authUser]);

  const next = () => {
    setCurrentStep(currentStep + 1);
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Datos de Accesso",
      description: "Paso 1",
    },
    {
      title: "Datos Personales",
      description: "Paso 2",
    },
    {
      title: "Registrarse",
      description: "Paso 3",
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Container>
      <div className="content-wrapper">
        <div className="wrapper-steps">
          <Steps
            current={currentStep}
            items={items}
            labelPlacement="vertical"
          />
        </div>
        <div className="content-step-wrapper">
          {currentStep === 0 && (
            <AccessData next={next} currentStep={currentStep} />
          )}
          {currentStep === 1 && (
            <PersonalInformation
              prev={prev}
              next={next}
              currentStep={currentStep}
            />
          )}
          {currentStep === 2 && <PrivacyPolicies prev={prev} />}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: auto;
  display: flex;
  justify-content: center;
  background-image: url(${MilitarSchool});
  background-repeat: no-repeat;
  background-size: cover;

  .content-wrapper {
    max-width: 40em;
    width: 100%;
    margin: 0 auto;
    padding: 3em 1em;
  }

  .wrapper-steps {
    padding: 0;
    .ant-steps-item-title {
      line-height: 17px !important;
      font-size: 12px;
    }
    ${mediaQuery.minTablet} {
      padding: 0 1.5em;
    }
  }

  .content-step-wrapper {
    width: auto;
    height: auto;
    padding: 1.7rem;
    border-radius: 1em;
    background: ${({ theme }) => theme.colors.white};
    margin-top: 3em;
  }
`;
