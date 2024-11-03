import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { VerificationBySmsAndSignInIntegration } from "./VerificationBySmsAndSignIn";
import { AccessDataLogin } from "./AccessDataLogin";
import { useAuthentication } from "../../providers";
import { useNavigate } from "react-router";
import { VerificationByEmailIntegration } from "./VerificationByEmail";

export const LoginIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    authUser && navigate("/home");
  }, [authUser]);

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Container>
      <div className="content-wrapper">
        <div className="content-step-wrapper">
          {currentStep === 0 && <AccessDataLogin next={next} />}
          {currentStep === 1 && (
            <VerificationByEmailIntegration
              prev={prev}
              next={next}
              currentStep={currentStep}
            />
          )}
          {[2, 3].includes(currentStep) && (
            <VerificationBySmsAndSignInIntegration
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
