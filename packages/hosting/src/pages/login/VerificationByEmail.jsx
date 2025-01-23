import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, notification, Row } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useCountdown, useFormUtils } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  useApiVerifyEmailSendCodePost,
  useApiVerifyEmailVerifyCodePost,
} from "../../api";
import { getLocalStorage } from "../../utils";
import {
  deleteSessionVerification,
  fetchUsersByCip,
} from "../../firebase/collections";
import { isEmpty } from "lodash";
import { Spin } from "antd";
import { isProduction } from "../../config";

export const VerificationByEmailIntegration = ({ prev, next, currentStep }) => {
  const { secondsLeft, start } = useCountdown();
  const [expiredVerifiedCode, setExpiredVerifiedCode] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [user, setUser] = useState(null);

  const {
    postVerifyEmailSendCode,
    postVerifyEmailSendCodeResponse,
    postVerifyEmailSendCodeLoading,
  } = useApiVerifyEmailSendCodePost();
  const {
    postVerifyEmailVerifyCode,
    postVerifyEmailVerifyCodeResponse,
    postVerifyEmailVerifyCodeLoading,
  } = useApiVerifyEmailVerifyCodePost();

  useEffect(() => {
    (async () => {
      const { cip } = getLocalStorage("login");
      const users = await fetchUsersByCip(cip);
      const user = users?.[0];

      if (isEmpty(user) || isEmpty(cip)) {
        return prev();
      }

      setUser(user);
      await fetchVerifyEmailSendCode(user);
    })();
  }, []);

  const fetchVerifyEmailSendCode = async (user) => {
    try {
      setLoadingSendCode(true);
      if (!user) {
        setExpiredVerifiedCode(true);
        return;
      }

      await deleteSessionVerification(user.id);
      await postVerifyEmailSendCode(user.id);
      setExpiredVerifiedCode(false);
      start(60);

      if (postVerifyEmailSendCodeResponse.data === "verify_code_exists") {
        return notification({
          type: "warning",
          title: "¡El código ya ha sido enviado!",
        });
      }

      notification({ type: "success", title: "¡Código enviado exitosamente!" });
    } catch (e) {
      console.error("Error postVerifyEmailSendCode: ", e);
      notification({ type: "error" });
    } finally {
      setLoadingSendCode(false);
    }
  };

  useEffect(() => {
    if (!expiredVerifiedCode) {
      const interval = setTimeout(() => {
        setExpiredVerifiedCode(true);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [expiredVerifiedCode]);

  const onVerifyEmailCode = async (formData) => {
    const { verificationCode } = formData;

    const verifyEmailVerifyCodeResponse = await postVerifyEmailVerifyCode(
      user.id,
      verificationCode,
    );

    if (!verifyEmailVerifyCodeResponse) {
      setExpiredVerifiedCode(true);
      notification({
        type: "warning",
        title: "¡El código no es correcto vuelva a inténtelo de nuevo!",
      });
      return;
    }

    setExpiredVerifiedCode(true);
    next();
  };

  return (
    <VerificationByEmail
      prev={prev}
      next={next}
      user={user}
      onVerifyEmailCode={onVerifyEmailCode}
      expiredVerifiedCode={expiredVerifiedCode}
      loadingSendCode={loadingSendCode || postVerifyEmailSendCodeLoading}
      loadingValidateCode={postVerifyEmailVerifyCodeLoading}
      onFetchVerifyEmailSendCode={fetchVerifyEmailSendCode}
      secondsLeft={secondsLeft}
    />
  );
};

const VerificationByEmail = ({
  prev,
  next,
  user,
  onVerifyEmailCode,
  expiredVerifiedCode,
  loadingSendCode,
  loadingValidateCode,
  onFetchVerifyEmailSendCode,
  secondsLeft,
}) => {
  const schema = yup.object({
    verificationCode: yup
      .string()
      .min(6)
      .max(6)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitVerifyEmailCode = async (formData) =>
    await onVerifyEmailCode(formData);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmitVerifyEmailCode)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h3>Verificación por Email</h3>
          </Col>
          <Col span={24}>
            <p>
              Ingresa el código de verificación de 6 dígitos enviado a{" "}
              <strong>{user?.email}</strong>.
            </p>
            <p>
              Si no le llego el código vuelva a reenviarlo e intentelo de nuevo.
            </p>
            {user?.roleCode === "super_admin" && (
              <p className="link-color" onClick={() => next()}>
                Soy super admin
              </p>
            )}
            {!isProduction && user?.roleCode !== "super_admin" && (
              <p className="link-color" onClick={() => next()}>
                Omit en dev
              </p>
            )}
          </Col>
          <Col span={24}>
            <Controller
              name="verificationCode"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  type="number"
                  label="Código de verificación"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  required={required(name)}
                  helperText={errorMessage(name)}
                  suffix={
                    expiredVerifiedCode ? (
                      loadingSendCode ? (
                        <Spin size="1x" style={{ padding: ".1em" }} />
                      ) : (
                        <a
                          href="#"
                          onClick={() => onFetchVerifyEmailSendCode(user)}
                        >
                          Obtener código
                        </a>
                      )
                    ) : (
                      <span>{secondsLeft > 0 && `${secondsLeft}`}</span>
                    )
                  }
                />
              )}
            />
          </Col>
          <Col col={24} style={{ width: "100%" }}>
            <Button
              block
              size="large"
              type="primary"
              loading={loadingValidateCode}
              htmlType="submit"
            >
              Validar código
            </Button>
          </Col>
          <Col span={24}>
            <span
              className="link link-color"
              style={{ cursor: "pointer" }}
              onClick={() => prev()}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Regresar
            </span>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
