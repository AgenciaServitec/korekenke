import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import { Button, Form, InputNumber, notification } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { firestore } from "../../firebase";
import { fetchCollectionOnce } from "../../firebase/utils";
import { Link } from "react-router-dom";
import { setLocalStorage } from "../../utils";

export const AccessDataLogin = ({ next }) => {
  const [loading, setLoading] = useState(false);

  const onSetLoading = (loading) => setLoading(loading);

  const schema = yup.object({
    cip: yup
      .string()
      .min(9)
      .max(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitLogin = async ({ cip }) => {
    try {
      onSetLoading(true);

      const user = await userByCip(cip);

      if (!user)
        return notification({
          type: "warning",
          title: "El código CIP, no se encuentra registrado!",
        });

      setLocalStorage("login", { cip, phoneNumber: user.phone.number });

      next();
    } catch (e) {
      console.error({ e });
      notification({ type: "error" });
    } finally {
      onSetLoading(false);
    }
  };

  const userByCip = async (cip) => {
    const response = await fetchCollectionOnce(
      firestore.collection("users").where("cip", "==", cip).limit(1)
    );

    return response[0];
  };

  return (
    <Container>
      <div className="title-login">
        <Title level={3}>Datos de acceso</Title>
      </div>
      <Form onSubmit={handleSubmit(onSubmitLogin)}>
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
        <Button
          block
          size="large"
          type="primary"
          loading={loading}
          htmlType="submit"
        >
          Siguiente
        </Button>
        <span>
          ¿No tienes una cuenta? <Link to="/register">Registrate</Link>
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
