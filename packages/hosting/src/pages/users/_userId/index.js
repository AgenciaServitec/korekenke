import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import {
  Button,
  CheckboxGroup,
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
import { assign, capitalize, flatten, map } from "lodash";
import { allRoles, ApiErrors } from "../../../data-list";
import { useApiUserPost, useApiUserPut } from "../../../api";
import moment from "moment";
import { filterAcl, mapAcls } from "../../../utils";

export const UserIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { postUser, postUserResponse, postUserLoading } = useApiUserPost();
  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();

  const { rolesAcls, users } = useGlobalData();

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
      const errorParse = JSON.parse(e.message);

      ApiErrors?.[errorParse.data]
        ? notification({ type: "warning", title: ApiErrors[errorParse.data] })
        : notification({ type: "error" });
    }
  };

  const saveUser = async (user) => {
    userId === "new" ? await postUser(user) : await putUser(user);

    const responseStatus = postUserResponse.ok || putUserResponse.ok;

    if (!responseStatus) {
      throw new Error(JSON.stringify(postUserResponse));
    }
  };

  const getOtherRoles = (otherRoleCodes = []) =>
    allRoles
      .filter((role) => otherRoleCodes.find((_role) => _role === role?.code))
      .map((role) => ({
        code: role?.code,
        name: role.name,
        imgUrl: role.imgUrl,
        updateAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      }));

  const mapUserToApi = (formData) =>
    assign(
      {},
      {
        ...(user?.id && { id: user.id }),
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
        acls: flatten(map(formData.acls, (acl) => acl).filter((acl) => acl)),
        updateBy: `${authUser.firstName} ${authUser.paternalSurname} ${authUser.maternalSurname}|${authUser.cip}|${authUser.dni}`,
      }
    );

  const onGoBack = () => navigate(-1);

  return (
    <User
      rolesAcls={rolesAcls}
      user={user}
      onSubmitSaveUser={onSubmitSaveUser}
      onGoBack={onGoBack}
      isSavingUser={postUserLoading || putUserLoading}
    />
  );
};

const User = ({
  rolesAcls,
  user,
  onSubmitSaveUser,
  onGoBack,
  isSavingUser,
}) => {
  const schema = yup.object({
    defaultRoleCode: yup.string().required(),
    otherRoleCodes: yup.array(),
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
      .max(8)
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
      otherRoleCodes: (user?.otherRoles || []).map((role) => role.code),
      firstName: user?.firstName || "",
      paternalSurname: user?.paternalSurname || "",
      maternalSurname: user?.maternalSurname || "",
      email: user?.email || "",
      cip: user?.cip || "",
      dni: user?.dni || "",
      phoneNumber: user?.phone?.number || "",
      acls: user.acls ? mapAcls(user.acls) : {},
    });
  };

  const onSelectRole = (onChange, roleCode = undefined) => {
    if (!roleCode) return;

    onChange(roleCode);

    const acls = currentAcls(roleCode);

    if (!acls) return;

    Object.entries(acls).forEach(([currentAclKey, currentAclValue]) => {
      setValue(`acls.${currentAclKey}`, currentAclValue);
    });
  };

  const currentAcls = (roleCode) => {
    if (roleCode === user.defaultRole) return mapAcls(user.acls);

    const roleAcls = rolesAcls.find((roleAcls_) => roleAcls_.id === roleCode);

    return mapAcls(roleAcls.acls);
  };

  const submitSaveUser = (formData) => onSubmitSaveUser(formData);

  return (
    <Row gutter={[16, 16]}>
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
                    onChange={(value) => onSelectRole(onChange, value)}
                    error={error(name)}
                    required={required(name)}
                    options={allRoles
                      .filter((role) =>
                        watch("otherRoleCodes")
                          ? !watch("otherRoleCodes").includes(role.code)
                          : true
                      )
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
                      .filter((role) =>
                        watch("defaultRoleCode")
                          ? role.code !== watch("defaultRoleCode")
                          : true
                      )
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
          <Title level={4}>Privilegios de usuario</Title>
          <Row gutter={[16, 24]}>
            <Col span={24}>
              <Controller
                name="acls.defaultRolesAcls"
                defaultValue={[]}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <CheckboxGroup
                    label="Default roles acls"
                    options={map(
                      filterAcl("default-roles-acls"),
                      (item, itemKey) => ({
                        label: item,
                        value: itemKey,
                      })
                    )}
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
                name="acls.manageAcls"
                defaultValue={[]}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <CheckboxGroup
                    label="Manage acls"
                    options={map(filterAcl("manage-acls"), (item, itemKey) => ({
                      label: item,
                      value: itemKey,
                    }))}
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
                name="acls.users"
                defaultValue={[]}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <CheckboxGroup
                    label="Usuarios"
                    options={map(
                      {
                        ...filterAcl("users"),
                      },
                      (item, itemKey) => ({
                        label: item,
                        value: itemKey,
                      })
                    )}
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
