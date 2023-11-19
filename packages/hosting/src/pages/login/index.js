import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { SendCodeSmsAndSignInWithCode } from "./SendCodeSmsAndSignInWithCode";
import { AccessDataLogin } from "./AccessDataLogin";
import { useAuthentication } from "../../providers";
import { useNavigate } from "react-router";

export const LoginIntegration = () => {
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
      title: "Código CIP",
      description: "Paso 1",
    },
    {
      title: "Envio SMS",
      description: "Paso 2",
    },
    {
      title: "Verficación código",
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
        <div className="content-step-wrapper">
          {currentStep === 0 && <AccessDataLogin next={next} />}
          {currentStep !== 0 && (
            <SendCodeSmsAndSignInWithCode
              prev={prev}
              next={next}
              currentStep={currentStep}
            />
          )}
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
