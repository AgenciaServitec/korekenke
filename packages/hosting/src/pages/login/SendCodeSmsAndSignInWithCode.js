import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, InputNumber, notification } from "../../components";
import styled from "styled-components";
import { firebase } from "../../firebase";
import { useNavigate } from "react-router";
import { capitalize } from "lodash";

export const SendCodeSmsAndSignInWithCode = ({ prev, next, currentStep }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const phoneNumber = JSON.parse(localStorage.getItem("login")).phoneNumber;

  const onSetLoading = (state = false) => setLoading(state);

  const handleSendCode = async () => {
    try {
      onSetLoading(true);

      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            applicationVerifier.clear();
          },
        }
      );

      if (!applicationVerifier) return applicationVerifier.clear();

      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(`+51${phoneNumber}`, applicationVerifier);

      setVerificationId(confirmationResult.verificationId);

      applicationVerifier.clear();
      next();
    } catch (e) {
      console.error("recaptchaVerifier and send code:", e);
      notification({ type: "error", title: e });
      prev();
    } finally {
      onSetLoading(false);
    }
  };

  const handleVerifyCode = async (verificationCode) => {
    try {
      onSetLoading(true);

      if (!verificationCode)
        return notification({
          type: "warning",
          title: "El código es requerido",
        });

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode.toString()
      );

      console.log({ credential });

      const userCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.log({ userCredential });

      if (!userCredential.user) throw new Error(userCredential);

      setVerificationId("");
    } catch (e) {
      console.error("verifyCode:", e);
      // const { message } = e?.error;
      notification({ type: "error", title: capitalize(e.message) });
    } finally {
      onSetLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!verificationCode)
      return notification({
        type: "warning",
        title: "Debe ingresar el código",
      });

    await handleVerifyCode(verificationCode);
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
      <div id="recaptcha-container"></div>
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
            onClick={() => onSubmit()}
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
