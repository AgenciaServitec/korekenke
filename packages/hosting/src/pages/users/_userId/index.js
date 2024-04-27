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
  InputPassword,
  notification,
  Select,
  Upload,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { firestore } from "../../../firebase";
import { useGlobalData } from "../../../providers";
import { assign, capitalize } from "lodash";
import { countriesISO, allRoles } from "../../../data-list";
import { useApiUserPost, useApiUserPut } from "../../../api";

export const UserIntegration = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { postUser, postUserResponse, postUserLoading } = useApiUserPost();
  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const { users } = useGlobalData();

  const [user, setUser] = useState({});

  useEffect(() => {
    const _user =
      userId === "new"
        ? { id: firestore.collection("users").doc().id }
        : users.find((user) => user.id === userId);

    if (!_user) return navigate(-1);

    setUser(_user);
  }, []);

  const onSubmitSaveUser = async (formData) => {
    try {
      const _user = mapUser(assignUpdateProps(formData));

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

  const mapUser = (formData) =>
    assign(
      {},
      {
        id: user.id,
        roleCode: formData.defaultRoleCode,
        firstName: formData.firstName.toLowerCase(),
        lastName: formData.lastName.toLowerCase(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: {
          number: formData.phoneNumber,
          prefix: formData.phonePrefix,
        },
        ...(formData?.profileImage && { profileImage: formData.profileImage }),
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
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    roleCode: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    phonePrefix: yup.string().required(),
    phoneNumber: yup.number().required(),
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
  }, [user]);

  const resetForm = () => {
    reset({
      roleCode: user?.defaultRoleCode || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: user?.password || "",
      phonePrefix: user?.phone?.prefix || "+51",
      phoneNumber: user?.phone?.number || "",
      profileImage: user?.profileImage || null,
    });
  };

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
                name="roleCode"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Rol"
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
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellidos"
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
                name="password"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <InputPassword
                    label="Contraseña"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={6} md={6}>
              <Controller
                name="phonePrefix"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Prefijo"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={countriesISO.map((countryIso) => ({
                      code: countryIso.code,
                      label: `${countryIso.name} (${countryIso.phonePrefix})`,
                      value: countryIso.phonePrefix,
                    }))}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={18} md={18}>
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
            <Col span={24}>
              <Controller
                name="profileImage"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <Upload
                    label="Foto"
                    accept="image/*"
                    name={name}
                    value={value}
                    filePath={`users/${user.id}`}
                    resize="400x400"
                    buttonText="Subir foto"
                    error={error(name)}
                    required={required(name)}
                    onChange={(file) => onChange(file)}
                    onUploading={setUploadingImage}
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
                disabled={uploadingImage | isSavingUser}
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
                disabled={uploadingImage}
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
