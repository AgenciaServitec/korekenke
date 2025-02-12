import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Title,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { firestore } from "../../firebase";
import { fetchCollectionOnce } from "../../firebase/utils";
import { getLocalStorage } from "../../utils";
import { useAuthentication } from "../../providers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const SignInByEmailPassword = ({ onSetCurrentStep }) => {
  const { loginWithEmailAndPassword } = useAuthentication();

  const [loading, setLoading] = useState(false);

  const onSetLoading = (loading) => setLoading(loading);

  const schema = yup.object({
    password: yup
      .string()
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitLogin = async ({ password }) => {
    try {
      onSetLoading(true);

      const cip = getLocalStorage("login")?.cip;

      const user = await userByCip(cip);

      if (!user)
        return notification({
          type: "warning",
          title: "El usuario, no se encuentra registrado!",
        });

      if (user.password !== password)
        return notification({
          type: "warning",
          title: "La contraseña es incorrecta",
        });

      await loginWithEmailAndPassword(user.email, user.password);
    } catch (e) {
      console.error({ e });
      notification({ type: "error" });
    } finally {
      onSetLoading(false);
    }
  };

  const userByCip = async (cip) => {
    const response = await fetchCollectionOnce(
      firestore.collection("users").where("cip", "==", cip).limit(1),
    );

    return response[0];
  };

  return (
    <Container>
      <Col span={24}>
        <h3>Iniciar sesión con contraseña</h3>
      </Col>
      <Col span={24}>
        <p>Usar la contraseña enviada a su correo:</p>
      </Col>
      <Form onSubmit={handleSubmit(onSubmitLogin)}>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese la contraseña enviada a su correo"
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
          Iniciar sesión
        </Button>
        <span
          className="link link-color"
          style={{ cursor: "pointer" }}
          onClick={() => {
            onSetCurrentStep(2);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Regresar
        </span>
      </Form>
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
`;
