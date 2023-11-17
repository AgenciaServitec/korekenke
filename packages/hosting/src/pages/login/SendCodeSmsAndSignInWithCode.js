import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, InputNumber } from "../../components";
import styled from "styled-components";
import { firebase } from "../../firebase";
import { useNavigate } from "react-router";

export const SendCodeSmsAndSignInWithCode = ({ prev, next, currentStep }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const phoneNumber = JSON.parse(localStorage.getItem("login")).phoneNumber;

  const onSetLoading = (state = false) => setLoading(state);

  const window = {
    recaptchaVerifier: undefined,
  };

  const handleSendCode = async () => {
    try {
      onSetLoading(true);

      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            window.recaptchaVerifier.reset();
          },
        }
      );

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(`+51${phoneNumber}`, appVerifier);

      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      next();
    } catch (e) {
      console.error("recaptchaVerifier and send code:", e);
      window.recaptchaVerifier.reset();
      prev();
    } finally {
      onSetLoading(false);
    }
  };

  const handleVerifyCode = () => {
    try {
      onSetLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode.toString()
      );

      firebase
        .auth()
        .signInWithCredential(credential)
        .then((userCredential) => {
          console.log("Usuario inició sesión correctamente: ", {
            userCredential,
          });

          navigate("/home");
        })
        .catch((error) => {
          console.error(error);
          prev();
        });
    } catch (e) {
      prev();
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <Container>
      {currentStep === 1 && (
        <div className="send-phone-code-wrapper">
          <div className="title-login">
            <Title level={3}>Verificación Código COBIENE</Title>
            <Title level={3}>+51 {phoneNumber}</Title>
          </div>
          <br />
          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            onClick={() => handleSendCode()}
          >
            Enviar
          </Button>
        </div>
      )}
      <div id="sign-in-button"></div>
      {currentStep === 2 && (
        <div className="verifier-and-signin-wrapper">
          <InputNumber
            label="Ingrese código"
            required
            value=""
            id="code"
            onChange={(value) => setVerificationCode(value)}
          />
          <br />
          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            onClick={() => handleVerifyCode()}
          >
            Iniciar sesion
          </Button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  .title-login {
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};

    h3 {
      color: inherit;
    }
  }
`;
