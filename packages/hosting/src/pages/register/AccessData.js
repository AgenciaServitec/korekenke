import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  notification,
  Title,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../../utils";
import { fetchCollectionOnce } from "../../firebase/utils";
import { firestore } from "../../firebase";
import { useApiPersonDataByDniGet } from "../../api";
import { capitalize } from "lodash";
import { LogoPrimary } from "../../images";

export const AccessData = ({ next, currentStep }) => {
  const { getPersonDataByDni } = useApiPersonDataByDniGet();
  const [savingData, setSavingData] = useState(false);

  const schema = yup.object({
    cip: yup
      .string()
      .min(9)
      .max(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
    dni: yup
      .string()
      .min(8)
      .max(8)
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
      dni: step1Data?.dni || null,
    });
  }, [currentStep]);

  const onSubmitRegister = async ({ cip, dni }) => {
    try {
      setSavingData(true);
      const userWithCip = await userByCip(cip);
      const userWithDni = await userByDni(dni);

      if (userWithCip || userWithDni)
        return notification({
          type: "warning",
          title: `El ${
            userWithCip ? "código CIP" : userWithDni ? "DNI" : ""
          }, ya se encuentra registrado!`,
        });

      const personData = await getPersonDataByDni(dni);

      setLocalStorage("register", {
        cip,
        dni,
        firstName: capitalize(personData?.nombres || ""),
        paternalSurname: capitalize(personData?.apellidoPaterno || ""),
        maternalSurname: capitalize(personData?.apellidoMaterno || ""),
      });

      next();
    } catch (e) {
      console.error("Error saveData: ", e);
      notification({ type: "error" });
    } finally {
      setSavingData(false);
    }
  };

  const userByCip = async (cip) => {
    const response = await fetchCollectionOnce(
      firestore.collection("users").where("cip", "==", cip).limit(1)
    );

    return response[0];
  };

  const userByDni = async (dni) => {
    const response = await fetchCollectionOnce(
      firestore.collection("users").where("dni", "==", dni).limit(1)
    );

    return response[0];
  };

  return (
    <Container>
      <div className="logo-login">
        <img src={LogoPrimary}></img>
      </div>
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
        <Controller
          name="dni"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <InputNumber
              label="Ingrese DNI"
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
          htmlType="submit"
          loading={savingData}
        >
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
  .logo-login {
    width: 80px;
    height: 100px;
    margin: auto;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title-login {
    padding-top: 1em;
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
