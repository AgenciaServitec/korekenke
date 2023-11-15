import React from "react";
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

export const PersonalInformation = ({ prev, next }) => {
  const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    dni: yup
      .string()
      .matches(/^\d+$/, { message: "Debe ingresar solo números" })
      .min(8)
      .required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().required(),
    degree: yup.string().required(),
    cgi: yup.boolean(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cgi: false,
    },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitLogin = (formData) => {
    const step1Data = JSON.parse(localStorage.getItem("register"));

    localStorage.setItem(
      "register",
      JSON.stringify({ ...step1Data, ...formData })
    );

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
          name="lastName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Ingrese apellidos"
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
          defaultValue=""
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
          defaultValue=""
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
          <Button block size="large" type="primary" onClick={() => prev()}>
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
