import React from "react";
import Title from "antd/es/typography/Title";
import { Button, Form, InputNumber } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const AccessData = ({ next }) => {
  const schema = yup.object({
    cip: yup
      .string()
      .matches(/^\d+$/, { message: "Debe ingresar solo números" })
      .min(8)
      .required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitRegister = ({ cip }) => {
    localStorage.setItem("register", JSON.stringify({ cip }));

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
