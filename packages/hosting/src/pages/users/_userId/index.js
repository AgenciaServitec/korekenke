import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../hooks";
import { useAuthentication, useGlobalData } from "../../../providers";
import { assign, capitalize } from "lodash";
import { allRoles } from "../../../data-list";
import { useApiUserPost, useApiUserPut } from "../../../api";
import moment from "moment";

export const UserIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { postUser, postUserResponse, postUserLoading } = useApiUserPost();
  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();

  const { users } = useGlobalData();

  const [user, setUser] = useState({});

  useEffect(() => {
    const _user =
      userId === "new" ? {} : users.find((user) => user.id === userId);

    if (!_user) return navigate(-1);

    setUser(_user);
  }, []);

  const onSubmitSaveUser = async (formData) => {
    try {
      const _user = mapUserToApi(formData);

      await saveUser(_user);

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.log("ErrorSaveUser: ", e);
      notification({ type: "error" });
    }
  };

  const saveUser = async (user) => {
    userId === "new" ? await postUser(user) : await putUser(user);

    const responseStatus = postUserResponse.ok || putUserResponse.ok;

    if (!responseStatus) return notification({ type: "error" });
  };

  const getOtherRoles = (otherRoleCodes = []) =>
    allRoles
      .filter((role) => otherRoleCodes.find((_role) => _role === role?.code))
      .map((role) => ({
        code: role?.code,
        name: role.name,
        imgUrl: role.imgUrl,
        updateAt: moment(),
      }));

  const mapUserToApi = (formData) =>
    assign(
      {},
      {
        defaultRoleCode: formData.defaultRoleCode,
        otherRoles: getOtherRoles(formData.otherRoleCodes),
        firstName: formData.firstName.toLowerCase(),
        paternalSurname: formData.paternalSurname.toLowerCase(),
        maternalSurname: formData.maternalSurname.toLowerCase(),
        email: formData.email.toLowerCase(),
        cip: formData.cip,
        dni: formData.dni,
        phone: {
          prefix: "+51",
          number: formData.phoneNumber,
        },
        updateBy: `${authUser.firstName} ${authUser.paternalSurname} ${authUser.maternalSurname}|${authUser.cip}|${authUser.dni}`,
      }
    );

  const onGoBack = () => navigate(-1);

  return (
    <User
      user={user}
      onSubmitSaveUser={onSubmitSaveUser}
      onGoBack={onGoBack}
      isSavingUser={postUserLoading || putUserLoading}
    />
  );
};

const User = ({ user, onSubmitSaveUser, onGoBack, isSavingUser }) => {
  const schema = yup.object({
    defaultRoleCode: yup.string().required(),
    otherRoleCodes: yup.array().notRequired().nullable(),
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    email: yup.string().email().required(),
    cip: yup
      .string()
      .min(9)
      .max(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
    dni: yup
      .string()
      .min(8)
      .required()
      .transform((value) => (value === null ? "" : value)),
    phoneNumber: yup
      .string()
      .min(9)
      .max(9)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [user]);

  const resetForm = () => {
    reset({
      defaultRoleCode: user?.defaultRoleCode || "",
      otherRoleCodes: user?.otherRoleCodes || "",
      firstName: user?.firstName || "",
      paternalSurname: user?.paternalSurname || "",
      maternalSurname: user?.maternalSurname || "",
      email: user?.email || "",
      cip: user?.cip || "",
      dni: user?.dni || "",
      phoneNumber: user?.phone?.number || "",
    });
  };

  useEffect(() => {
    setValue("otherRoleCodes", []);
  }, [watch("defaultRoleCode")]);

  const submitSaveUser = (formData) => onSubmitSaveUser(formData);

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Usuario</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(submitSaveUser)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="defaultRoleCode"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Rol predeterminado"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={allRoles.map((role) => ({
                      label: capitalize(role.name),
                      value: role.code,
                    }))}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="otherRoleCodes"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Otros roles"
                    mode="multiple"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={allRoles
                      .filter((role) => role.code !== watch("defaultRoleCode"))
                      .map((role) => ({
                        label: capitalize(role.name),
                        value: role.code,
                      }))}
                  />
                )}
              />
            </Col>
            <Col span={24}>
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
            <Col span={24}>
              <Controller
                name="paternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido paterno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="maternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido materno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Email"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="cip"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="CIP"
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="dni"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="DNI"
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="Ingrese teléfono"
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
                disabled={isSavingUser}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={isSavingUser}
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
