import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  IconAction,
  Input,
  InputNumber,
  notification,
  Select,
} from "../../../components";
import { Col, Row } from "antd/lib";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useAuthentication } from "../../../providers";
import { assign } from "lodash";
import { useFormUtils } from "../../../hooks";
import { useApiUserPut } from "../../../api";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { faAddressBook, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CmstsForm = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();

  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();

  const mapUser = (formData) =>
    assign({}, formData, {
      id: authUser.id,
      email: authUser.email,
      phone: authUser.phone,
      birthdate: moment(formData.birthdate).format("YYYY-MM-DD HH:mm:ss"),
      emergencyCellPhone: {
        number: formData.emergencyCellPhone,
        prefix: "+51",
      },
    });

  const onUpdateCmstsUser = async (formData) => {
    try {
      const user = mapUser(formData);

      await putUser(user);

      if (!putUserResponse.ok) {
        throw new Error(JSON.stringify(putUserResponse));
      }

      notification({ type: "success" });
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    cip: yup.string().min(9).max(9).required(),
    dni: yup.string().min(8).max(8).required(),
    civilStatus: yup.string().required(),
    gender: yup.string().required(),
    placeBirth: yup.string().required(),
    birthdate: yup.date().required(),
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
    resolver: yupResolver(schema),
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
      birthdate: authUser?.birthdate
        ? moment(authUser.birthdate, "YYYY-MM-DD HH:mm:ss")
        : undefined,
      houseLocation: authUser?.houseLocation || "",
      urbanization: authUser?.urbanization || "",
      address: authUser?.address || "",
      emergencyCellPhone: authUser?.emergencyCellPhone?.number || "",
    });
  };

  const onNavigateTo = (pathName) => navigate(pathName);

  const onSubmit = (formData) => onUpdateCmstsUser(formData);

  return (
    <Row gutter={[16, 16]}>
      <Col sm={24}>
        <Space
          align="middle"
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <IconAction
            className="pointer"
            onClick={() => onNavigateTo("/inscriptions/cmsts/sheet")}
            styled={{ color: (theme) => theme.colors.error }}
            icon={faFilePdf}
          />
          <Button
            type="primary"
            onClick={() => onNavigateTo("/inscriptions/cmsts/all")}
          >
            <FontAwesomeIcon icon={faAddressBook} /> &nbsp; Ver todos los
            inscritos
          </Button>
        </Space>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={putUserLoading}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};