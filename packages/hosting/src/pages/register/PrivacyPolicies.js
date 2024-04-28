import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, Checkbox, Form, notification } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { useNavigate } from "react-router";
import { clearLocalStorage, getLocalStorage } from "../../utils";
import { useApiUserPost } from "../../api";
import { assign } from "lodash";

export const PrivacyPolicies = ({ prev }) => {
  const navigate = useNavigate();
  const { postUser, postUserLoading, postUserResponse } = useApiUserPost();

  const [savingUser, setSavingUser] = useState(false);

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

  const onSubmit = async ({ iAcceptPrivacyPolicies }) => {
    try {
      setSavingUser(true);

      const prevData = getLocalStorage("register");

      await postUser(
        assign({}, prevData, {
          firstName: prevData.firstName.toLocaleLowerCase(),
          paternalSurname: prevData.paternalSurname.toLocaleLowerCase(),
          maternalSurname: prevData.maternalSurname.toLocaleLowerCase(),
          iAcceptPrivacyPolicies,
        })
      );

      if (!postUserResponse.ok) throw new Error("Register error");

      notification({ type: "success", title: "Registro exitoso" });

      clearLocalStorage();

      onNavigateGoToLogin();
    } catch (e) {
      console.error({ e });
      notification({ type: "error" });
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <Container>
      <div className="title-login">
        <Title level={3}>POLÍTICAS DE PRIVACIDAD</Title>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
            disabled={savingUser || postUserLoading}
            onClick={() => prev()}
          >
            Atras
          </Button>
          <Button
            block
            size="large"
            type="primary"
            loading={savingUser}
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
