import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { VerificationBySmsAndSignInIntegration } from "./VerificationBySmsAndSignIn";
import { AccessDataLogin } from "./AccessDataLogin";
import { useAuthentication } from "../../providers";
import { useNavigate } from "react-router";
import { VerificationByEmailIntegration } from "./VerificationByEmail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { SignInByEmailPassword } from "./SignInByEmailPassword";
import { getLocalStorage } from "../../utils";
import { fetchUsersByCip } from "../../firebase/collections";
import { isEmpty } from "lodash";

export const LoginIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authUser && navigate("/home");
  }, [authUser]);

  useEffect(() => {
    (async () => {
      if (getLocalStorage("login")) {
        const { cip = "" } = getLocalStorage("login");
        if (isEmpty(cip)) return;

        const users = await fetchUsersByCip(cip);
        const user = users?.[0];

        if (isEmpty(user) || isEmpty(cip)) {
          return prev();
        }

        setUser(user);
      }
    })();
  }, [getLocalStorage("login")]);

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
          {[2, 3, 4].includes(currentStep) && (
            <VerificationBySmsAndSignInIntegration
              user={user}
              prev={prev}
              next={next}
              currentStep={currentStep}
              onSetCurrentStep={setCurrentStep}
            />
          )}
          {[5].includes(currentStep) && (
            <SignInByEmailPassword
              user={user}
              onSetCurrentStep={setCurrentStep}
            />
          )}
        </div>
      </div>
      <div className="btn-whatsapp">
        <a
          href="https://api.whatsapp.com/send?phone=51929054672"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faWhatsapp} size="3x" />
        </a>
        <span>Soporte Korekenke</span>
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
  position: relative;

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

  .btn-whatsapp {
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    background-color: #5cc753;
    animation-name: btn-whatsapp;
    animation-duration: 2s;
    animation-delay: 1s;
    animation-iteration-count: infinite;

    @keyframes btn-whatsapp {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.1);
      }
    }

    a {
      text-decoration: none;
      color: #fff;
    }

    span {
      width: 4.85rem;
      display: flex;
      position: absolute;
      top: 50%;
      left: -5.5rem;
      padding: 0.2rem 0.6rem;
      border-radius: 0.3rem;
      transform: translateY(-50%);
      font-size: 0.8rem;
      font-weight: 500;
      background-color: #fff;
    }
  }
`;
