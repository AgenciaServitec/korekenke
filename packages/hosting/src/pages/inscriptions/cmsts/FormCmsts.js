import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "../../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Title from "antd/lib/typography/Title";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useAuthentication } from "../../../providers";
import { assign } from "lodash";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";

export const FormCmsts = () => {
  const { authUser } = useAuthentication();

  console.log(authUser);

  const { assignUpdateProps } = useDefaultFirestoreProps;

  const onSubmitSaveCmstsUser = async (formData) => {

  };

  const navigate = useNavigate();

  // const updateUser = async (user) => {
  //   await putUser(user)
  // };

  const mapCmstsUser = (formData) =>
    assign(
      {},
      {
        firstName: formData.firstName.toLowerCase(),
        paternalSurname: formData.paternalSurname.toLowerCase(),
        maternalSurname: formData.maternalSurname.toLowerCase(),
        phone: {
          number: formData.phoneNumber,
          prefix: formData.phonePrefix,
        },
        cip: formData.cip.toLowerCase(),
        dni: formData.dni.toLowerCase(),
        civilStatus: formData.civilStatus.toLowerCase(),
        gender: formData.gender.toLowerCase(),
        placeBirth: formData.placeBirth.toLowerCase(),
        birthdate: formData.birthdate.toLowerCase(),
        houseLocation: formData.houseLocation.toLowerCase(),
        urbanization: formData.urbanization.toLowerCase(),
        address: formData.address.toLowerCase(),
        emergencyCellPhone: formData.emergencyCellPhone,
      }
    );

  const onGoBack = () => navigate(-1);

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    cip: yup.string().min(9).max(9).required(),
    dni: yup.string().min(8).max(8).required(),
    civilStatus: yup.string().required(),
    gender: yup.string().required(),
    placeBirth: yup.string().required(),
    birthdate: yup.string().required(),
    houseLocation: yup.string().required(),
    urbanization: yup.string().required(),
    address: yup.string().required(),
    emergencyCellPhone: yup.string().min(9).max(9).required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      active: false,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const resetForm = () => {
    reset({
      firstName: authUser?.firstName || "",
      paternalSurname: authUser?.paternalSurname || "",
      maternalSurname: authUser?.maternalSurname || "",
      cip: authUser?.cip || "",
      dni: authUser?.dni || "",
      civilStatus: authUser?.civilStatus || "",
      gender: authUser?.gender || "",
      placeBirth: authUser?.placeBirth || "",
      birthdate: authUser?.birthdate || "",
      houseLocation: authUser?.houseLocation || "",
      urbanization: authUser?.urbanization || "",
      address: authUser?.address || "",
      emergencyCellPhone: authUser?.phoneNumber || "",
    });
  };

  const submitSaveCmstsUser = (formData) => onSubmitSaveCmstsUser(formData);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>
          Circulo Militar de Superiores tecnicos y sub oficiales
        </Title>
      </Col>
      <Col span={24}>
        <Form onsubmit={handleSubmit(submitSaveCmstsUser)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombres"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="paternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido Paterno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="maternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido Materno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="cip"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="CIP"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="dni"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="DNI"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="civilStatus"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Estado Civil"
                    defaultValue=""
                    value={value}
                    onChange={onchange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "single",
                        label: "Soltero",
                      },
                      {
                        value: "married",
                        label: "Casado",
                      },
                      {
                        value: "widower",
                        label: "Viudo",
                      },
                      {
                        value: "divorced",
                        label: "Divorciado",
                      },
                      {
                        value: "separate",
                        label: "Separado",
                      },
                      {
                        value: "cohabitant",
                        label: "Conviviente",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Género"
                    defaultValue=""
                    value={value}
                    onChange={onchange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "male",
                        label: "Masculino",
                      },
                      {
                        value: "female",
                        label: "Femenino",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="placeBirth"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Nacimiento"
                    defaultValue=""
                    value={value}
                    onChange={onchange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "lima",
                        label: "Lima",
                      },
                      {
                        value: "cusco",
                        label: "Cusco",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="birthdate"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha de Nacimiento"
                    name={name}
                    value={value}
                    onChange={onchange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="houseLocation"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Vivienda"
                    defaultValue=""
                    value={value}
                    onChange={onchange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "lima",
                        label: "Lima",
                      },
                      {
                        value: "cusco",
                        label: "Cusco",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="urbanization"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Urbanización"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Dirección"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="emergencyCellPhone"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="Celular de Emergencia"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onGoBack()}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button type="primary" size="large" block htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
