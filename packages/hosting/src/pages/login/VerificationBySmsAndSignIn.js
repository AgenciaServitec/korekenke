import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  InputCode,
  notification,
  Title,
} from "../../components";
import styled from "styled-components";
import { getLocalStorage } from "../../utils";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useFormUtils } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import { Row } from "antd";

export const VerificationBySmsAndSignInIntegration = ({
  prev,
  next,
  currentStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const phoneNumber = getLocalStorage("login")?.phoneNumber;

  const onSetLoading = (state = false) => setLoading(state);

  const onSendCodeSms = async () => {
    try {
      onSetLoading(true);

      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            applicationVerifier.clear();
            notification({
              type: "warning",
              title: "El tiempo a expirado, vuelva a intentarlo",
            });
            gRecaptchaReset();
          },
        },
      );

      if (!applicationVerifier) {
        gRecaptchaReset();
        applicationVerifier.clear();
        return;
      }

      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(`+51${phoneNumber}`, applicationVerifier);

      setVerificationId(confirmationResult.verificationId);

      applicationVerifier.clear();
      next();
    } catch (e) {
      console.error("onSendCodeSms:", e);
      notification({ type: "error", title: e.message });
      setVerificationId(null);
      gRecaptchaReset();
      prev();
    } finally {
      onSetLoading(false);
    }
  };

  const onVerifyCodeSmsAndSignIn = async (verificationCode) => {
    try {
      onSetLoading(true);

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode.toString(),
      );

      const userCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      if (!userCredential.user) throw new Error(userCredential);

      setVerificationId("");
    } catch (e) {
      console.error("verifyCodeSmsAndSignIn:", e);
      const codeType = "auth/invalid-verification-code" === e?.code;
      notification({
        type: "error",
        title: codeType ? "El código de verificación no es válido." : e.message,
      });
      gRecaptchaReset();
    } finally {
      onSetLoading(false);
    }
  };

  const gRecaptchaReset = () => {
    if (window?.recaptchaVerifier) {
      window.recaptchaVerifier
        .render()
        .then((widgetId) => {
          window.grecaptcha.reset(widgetId);
        })
        .catch((error) => {
          console.error("Error resetting reCAPTCHA", error);
        });

      document.getElementById("recaptcha-container").innerHTML = "";

      window.recaptchaVerifier.clear();
    }
  };

  return (
    <VerificationBySmsAndSignIn
      currentStep={currentStep}
      onSendCodeSms={onSendCodeSms}
      onVerifyCodeSmsAndSignIn={onVerifyCodeSmsAndSignIn}
      loading={loading}
      phoneNumber={phoneNumber}
      prev={prev}
    />
  );
};

const VerificationBySmsAndSignIn = ({
  currentStep,
  loading,
  phoneNumber,
  onSendCodeSms,
  onVerifyCodeSmsAndSignIn,
  prev,
}) => {
  const schema = yup.object({
    verificationCode: yup
      .string()
      .min(6)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitSignIn = async (formData) =>
    await onVerifyCodeSmsAndSignIn(formData.verificationCode);

  return (
    <Container>
      {currentStep === 2 && (
        <div className="send-phone-code-wrapper">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <h3>Verificación por Teléfono</h3>
            </Col>
            <Col span={24}>
              <p>Envía el código de 6 dígitos al siguiente teléfono:</p>
            </Col>
            <Col span={24}>
              <div className="title-login">
                <Title level={3}>+51 {phoneNumber}</Title>
              </div>
            </Col>
          </Row>
          <br />
          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            onClick={() => onSendCodeSms()}
          >
            {loading ? "Enviando" : "Enviar"}
          </Button>
          <br />
          <br />
          <div>
            <span
              className="link link-color"
              style={{ cursor: "pointer" }}
              onClick={() => {
                document.getElementById("recaptcha-container").innerHTML = "";
                prev();
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Regresar
            </span>
          </div>
        </div>
      )}
      <div id="recaptcha-container"></div>
      {currentStep === 3 && (
        <Form onSubmit={handleSubmit(onSubmitSignIn)}>
          <div className="title-login">
            <Title level={3}>Ingresa el código e inicia sesión</Title>
          </div>
          <Controller
            name="verificationCode"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <InputCode
                label="Ingrese código"
                onChange={onChange}
                value={value}
                name={name}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            {loading ? "Iniciando sesión" : "Iniciar sesión"}
          </Button>
          <span
            className="link link-color"
            style={{ cursor: "pointer" }}
            onClick={() => {
              document.getElementById("recaptcha-container").innerHTML = "";
              prev();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </span>
        </Form>
      )}
    </Container>
  );
};

const Container = styled.div`
  .title-login {
    color: ${({ theme }) => theme.colors.primary};

    h3 {
      text-align: center;
      color: inherit;
    }

    .link {
      cursor: pointer;
    }
  }
`;
