import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, Form, InputCode, notification } from "../../components";
import styled from "styled-components";
import { firebase } from "../../firebase";
import { getLocalStorage } from "../../utils";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useFormUtils } from "../../hooks";

export const SendCodeSmsAndSignInWithCodeIntegration = ({
  prev,
  next,
  currentStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  const phoneNumber = getLocalStorage("login").phoneNumber;

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
              title: "El tiempo a expirado, vuela a intentarlo",
            });
            prev();
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
      console.error("onSendCodeSms:", e);
      notification({ type: "error", title: e.message });
      setVerificationId("");
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
        verificationCode.toString()
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
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <SendCodeSmsAndSignInWithCode
      currentStep={currentStep}
      onSendCodeSms={onSendCodeSms}
      onVerifyCodeSmsAndSignIn={onVerifyCodeSmsAndSignIn}
      loading={loading}
      phoneNumber={phoneNumber}
    />
  );
};

const SendCodeSmsAndSignInWithCode = ({
  currentStep,
  loading,
  phoneNumber,
  onSendCodeSms,
  onVerifyCodeSmsAndSignIn,
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
            onClick={() => onSendCodeSms()}
          >
            {loading ? "Enviando" : "Enviar"}
          </Button>
        </div>
      )}
      <div id="recaptcha-container"></div>
      {currentStep === 2 && (
        <Form onSubmit={handleSubmit(onSubmitSignIn)}>
          <div className="title-login">
            <Title level={3}>Verifica e inicia sesión</Title>
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
        </Form>
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
