import React, { useEffect } from "react";
import Title from "antd/es/typography/Title";
import { Button, Form, InputNumber } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../../utils";

export const AccessData = ({ next, currentStep }) => {
  const schema = yup.object({
    cip: yup
      .string()
      .min(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const step1Data = getLocalStorage("register");

  useEffect(() => {
    reset({
      cip: step1Data?.cip || null,
    });
  }, [currentStep]);

  const onSubmitRegister = ({ cip }) => {
    setLocalStorage("register", { cip });

    next();
  };

  return (
    <Container>
      <div className="title-login">
        <Title level={3}>Registro</Title>
      </div>
      <Form onSubmit={handleSubmit(onSubmitRegister)}>
        <Controller
          name="cip"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <InputNumber
              label="Ingrese CIP"
              onChange={onChange}
              value={value}
              name={name}
              error={error(name)}
              helperText={errorMessage(name)}
              required={required(name)}
            />
          )}
        />
        <Button block size="large" type="primary" htmlType="submit">
          Siguiente
        </Button>
        <span>
          ¿Ya tienes una cuenta? <Link to="/">Inicio sesión</Link>
        </span>
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

  .item-text {
    text-align: left;
    margin: 1em auto;
  }

  .content-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;

    .item-icon {
      margin-right: 0.5em;
      font-size: 1.5em;
    }
  }

  .bottom-wrapper {
    display: flex;
    justify-content: start;
    margin-top: 1em;
    gap: 0.5em;
    a {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
