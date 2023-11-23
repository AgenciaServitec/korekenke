import React, { useEffect } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../hooks";
import {
  Button,
  Form,
  Input,
  notification,
  RadioGroup,
} from "../../components";
import { useAuthentication } from "../../providers";
import { useApiUserPut } from "../../api";

export const ProfileDataForm = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.number().required(),
    cip: yup
      .string()
      .min(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
    dni: yup
      .string()
      .min(8)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, errorMessage, required } = useFormUtils({ errors, schema });

  const onSubmit = async (formData) => {
    await startUpdateProfile(formData);
  };

  const startUpdateProfile = async (formData) => {
    try {
      await putUser({ ...authUser, ...formData });

      if (!putUserResponse.ok) throw new Error("Error in updateProfile");

      notification({ type: "success" });
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    }
  };

  const resetForm = () => {
    reset({
      firstName: authUser?.firstName || "",
      maternalSurname: authUser?.maternalSurname || "",
      paternalSurname: authUser?.paternalSurname || "",
      email: authUser?.email || "",
      phoneNumber: authUser?.phoneNumber || "",
      cip: authUser?.cip || "",
      dni: authUser?.dni || "",
      cgi: authUser?.cgi || false,
    });
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Nombres"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="dni"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="DNI"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="paternalSurname"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Apellido paterno"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>

        <Col span={24} md={12}>
          <Controller
            name="maternalSurname"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Apellido materno"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Email"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="cip"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="CIP"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="N° Celular"
                type="number"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
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
        </Col>
      </Row>

      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={putUserLoading}
            disabled={putUserLoading}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
