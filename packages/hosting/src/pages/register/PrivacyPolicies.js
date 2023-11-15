import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, Checkbox, Form, notification } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router";

export const PrivacyPolicies = ({ prev }) => {
  const navigate = useNavigate();
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

  const onSubmitLogin = ({ iAcceptPrivacyPolicies }) => {
    try {
      setLoading(true);

      const prevData = JSON.parse(localStorage.getItem("register"));

      console.log("registerData: ", { ...prevData, iAcceptPrivacyPolicies });

      const userData = { ...prevData, iAcceptPrivacyPolicies };

      const usersRef = firestore.collection("users");

      const userId = usersRef.doc().id;

      usersRef.doc(userId).set({ id: userId, ...userData });

      notification({ type: "success", title: "Registro exitoso" });

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
          <Button
            block
            size="large"
            type="primary"
            disabled={loading}
            onClick={() => prev()}
          >
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
