import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, Checkbox, Form, notification } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router";
import { clearLocalStorage, getLocalStorage } from "../../utils";

export const PrivacyPolicies = ({ prev }) => {
  const navigate = useNavigate();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);

  const onNavigateGoToLogin = () => navigate("/");

  const schema = yup.object({
    iAcceptPrivacyPolicies: yup
      .mixed()
      .oneOf([true], "Se deben aceptar la Política de Privacidad."),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      iAcceptPrivacyPolicies: false,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmitLogin = async ({ iAcceptPrivacyPolicies }) => {
    try {
      setLoading(true);

      const usersRef = firestore.collection("users");

      const prevData = getLocalStorage("register");

      const userId = usersRef.doc().id;

      await usersRef
        .doc(userId)
        .set(
          assignCreateProps({ id: userId, ...prevData, iAcceptPrivacyPolicies })
        );

      notification({ type: "success", title: "Registro exitoso" });

      clearLocalStorage();

      onNavigateGoToLogin();
    } catch (e) {
      console.error({ e });
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="title-login">
        <Title level={3}>POLÍTICAS DE PRIVACIDAD</Title>
      </div>
      <Form onSubmit={handleSubmit(onSubmitLogin)}>
        <Controller
          name="iAcceptPrivacyPolicies"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Checkbox
              checked={value}
              onChange={(checked) => onChange(checked)}
              error={error(name)}
              required={required(name)}
            >
              He leído y acepto la{" "}
              <a href="#" target="_blank" rel="noreferrer">
                Política de Privacidad
              </a>
            </Checkbox>
          )}
        />
        <div className="btns-wrapper">
          <Button block size="large" disabled={loading} onClick={() => prev()}>
            Atras
          </Button>
          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            Registrarme
          </Button>
        </div>
      </Form>
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

  .btns-wrapper {
    display: flex;
    gap: 1em;
    flex-direction: column;
    ${mediaQuery.minMobileS} {
      flex-direction: row;
    }
  }
`;
