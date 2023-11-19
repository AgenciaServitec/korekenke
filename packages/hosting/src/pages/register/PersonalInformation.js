import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  RadioGroup,
  Select,
  Title,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { DegreesArmy } from "../../data-list";
import { getLocalStorage, setLocalStorage } from "../../utils";

export const PersonalInformation = ({ prev, next, currentStep }) => {
  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    dni: yup
      .string()
      .min(8)
      .required()
      .transform((value) => (value === null ? "" : value)),
    email: yup.string().email().required(),
    phoneNumber: yup
      .string()
      .min(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
    degree: yup.string().required(),
    cgi: yup.boolean(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dni: "",
      phoneNumber: "",
      cgi: false,
    },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const step1Data = getLocalStorage("register");

  useEffect(() => {
    reset({
      firstName: step1Data?.firstName || "",
      paternalSurname: step1Data?.paternalSurname || "",
      maternalSurname: step1Data?.maternalSurname || "",
      dni: step1Data?.dni || "",
      email: step1Data?.email || "",
      phoneNumber: step1Data?.phoneNumber || "",
      degree: step1Data?.degree || "",
      cgi: step1Data?.cgi || false,
    });
  }, [currentStep]);

  console.log({ errors });

  const onSubmitLogin = (formData) => {
    setLocalStorage("register", { ...step1Data, ...formData });

    next();
  };

  return (
    <Container>
      <div className="title">
        <Title level={3}>DATOS PERSONALES</Title>
      </div>
      <Form onSubmit={handleSubmit(onSubmitLogin)}>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese nombres"
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
          name="paternalSurname"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese apellido paterno"
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
          name="maternalSurname"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese apellido materno"
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
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese email"
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
          name="phoneNumber"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <InputNumber
              label="Ingrese teléfono"
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
          name="degree"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Select
              label="Seleccione grado"
              onChange={onChange}
              value={value}
              name={name}
              error={error(name)}
              helperText={errorMessage(name)}
              required={required(name)}
              options={DegreesArmy}
            />
          )}
        />
        <Controller
          name="cgi"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <RadioGroup
              label="Perteneces a discapacitados, CGI? "
              onChange={onChange}
              value={value}
              name={name}
              error={error(name)}
              helperText={errorMessage(name)}
              required={required(name)}
              options={[
                {
                  label: "SI",
                  value: true,
                },
                {
                  label: "NO",
                  value: false,
                },
              ]}
            />
          )}
        />
        <div className="btns-wrapper">
          <Button block size="large" onClick={() => prev()}>
            Atras
          </Button>
          <Button block size="large" type="primary" htmlType="submit">
            Siguiente
          </Button>
        </div>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .title {
    color: ${({ theme }) => theme.colors.primary};

    h3 {
      color: inherit;
      text-align: center;
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
