import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, notification, Row } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useFormUtils } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";
import {
  useApiVerifyEmailSendCodePost,
  useApiVerifyEmailVerifyCodePost,
} from "../../api";
import { getLocalStorage } from "../../utils";
import { fetchUsersByCip } from "../../firebase/collections";
import { isEmpty } from "lodash";

export const VerificationByEmailIntegration = ({ prev, next, currentStep }) => {
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
      await fetchVerifyEmailSendCode();
    })();
  }, []);

  const fetchVerifyEmailSendCode = async () => {
    try {
      setLoadingSendCode(true);
      if (!user) {
        setExpiredVerifiedCode(true);
        return;
      }

      await postVerifyEmailSendCode(user.id);

      if (postVerifyEmailSendCodeResponse.data === "verify_code_exists") {
        return notification({
          type: "warning",
          title: "El código ya a sido enviado!",
        });
      }

      notification({ type: "success", title: "Código enviado exitosamente!" });
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
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [expiredVerifiedCode]);

  const onVerifyEmailCode = async (formData) => {
    const { verificationCode } = formData;

    const verifyEmailVerifyCodeResponse = await postVerifyEmailVerifyCode(
      user.id,
      verificationCode,
    );

    console.log(
      "verifyEmailVerifyCodeResponse: ",
      verifyEmailVerifyCodeResponse,
    );

    if (!verifyEmailVerifyCodeResponse) {
      setExpiredVerifiedCode(true);
      notification({
        type: "warning",
        title:
          "El código no es correcto o a expirado, vuelva a reenviar un nuevo código, e intentelo de nuevo!",
      });
      return;
    }

    setExpiredVerifiedCode(true);

    next();
  };

  return (
    <VerificationByEmail
      prev={prev}
      onVerifyEmailCode={onVerifyEmailCode}
      expiredVerifiedCode={expiredVerifiedCode}
      setExpiredVerifiedCode={setExpiredVerifiedCode}
      loadingSendCode={loadingSendCode || postVerifyEmailSendCodeLoading}
      loadingValidateCode={postVerifyEmailVerifyCodeLoading}
      onFetchVerifyEmailSendCode={fetchVerifyEmailSendCode}
    />
  );
};

const VerificationByEmail = ({
  prev,
  onVerifyEmailCode,
  expiredVerifiedCode,
  setExpiredVerifiedCode,
  loadingSendCode,
  loadingValidateCode,
  onFetchVerifyEmailSendCode,
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

  const onSubmitVerifyEmailCode = async (formData) =>
    await onVerifyEmailCode(formData);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmitVerifyEmailCode)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h3 onClick={() => setExpiredVerifiedCode(false)}>
              Verificación por Email
            </h3>
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
                          onClick={() => onFetchVerifyEmailSendCode()}
                        >
                          Reenviar
                        </a>
                      )
                    ) : (
                      <span>En espera</span>
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
              Enviar
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