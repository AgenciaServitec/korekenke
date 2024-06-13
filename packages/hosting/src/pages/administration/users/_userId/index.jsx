import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  RadioGroup,
  Row,
  Select,
  Title,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../../hooks";
import { useAuthentication, useGlobalData } from "../../../../providers";
import { assign, capitalize, isEmpty } from "lodash";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPost,
  useApiUserPut,
} from "../../../../api";
import { getTypeForAssignedToByRoleCode } from "../../../../utils";
import { DegreesArmy, INITIAL_HIGHER_ENTITIES } from "../../../../data-list";

export const UserIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { postUser, postUserResponse, postUserLoading } = useApiUserPost();
  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();
  const { rolesAcls, users } = useGlobalData();

  const [user, setUser] = useState({});

  const isNew = userId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _user = isNew ? {} : users.find((user) => user.id === userId);

    if (!_user) return navigate(-1);

    setUser(_user);
  }, []);

  const saveUser = async (formData) => {
    try {
      //Validate to assignTo when role code change of user
      if (user.roleCode !== formData.roleCode) {
        if (!isEmpty(user?.assignedTo?.id)) {
          return notification({
            type: "warning",
            title: "Este usuario está asignado como miembro",
            description:
              "Para realizar el cambio del rol, no debe estar como miembro en ningún grupo como (departamento, sección u oficina)",
          });
        }
      }

      const _user = mapUserToApi(formData);

      const response = isNew ? await postUser(_user) : await putUser(_user);

      if (isNew ? !postUserResponse.ok : !putUserResponse.ok) {
        throw new Error(response);
      }

      notification({
        type: "success",
        title: "¡El usuario se guardó correctamente!",
      });

      return onGoBack();
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  const mapUserToApi = (formData) =>
    assign(
      {},
      {
        ...(user?.id && { id: user.id }),
        roleCode: formData.roleCode,
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
        acls: rolesAcls.find((role) => role.id === formData.roleCode)?.acls || [
          "/home",
          "/profile",
        ],
        updateBy: `${authUser.firstName} ${authUser.paternalSurname} ${authUser.maternalSurname}|${authUser.cip}|${authUser.dni}`,
        assignedTo:
          user.roleCode !== formData.roleCode
            ? {
                type: getTypeForAssignedToByRoleCode(formData.roleCode),
                id: null,
              }
            : user.assignedTo,
        degree: formData.degree,
        commandsIds: formData.commandsIds,
        cgi: formData.cgi,
      }
    );

  return (
    <User
      user={user}
      onSaveUser={saveUser}
      onGoBack={onGoBack}
      rolesAcls={rolesAcls}
      isSavingUser={postUserLoading || putUserLoading}
    />
  );
};

const User = ({ user, onSaveUser, onGoBack, rolesAcls, isSavingUser }) => {
  const schema = yup.object({
    roleCode: yup.string().required(),
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
    degree: yup.string(),
    commandsIds: yup.array().required(),
    cgi: yup.boolean().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: "",
      cgi: false,
      commandsIds: null,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [user]);

  const resetForm = () => {
    reset({
      roleCode: user?.roleCode || "",
      firstName: user?.firstName || "",
      paternalSurname: user?.paternalSurname || "",
      maternalSurname: user?.maternalSurname || "",
      email: user?.email || "",
      cip: user?.cip || "",
      dni: user?.dni || "",
      phoneNumber: user?.phone?.number || "",
      degree: user?.degree || "",
      commandsIds: !isEmpty(user?.commandsIds) ? user.commandsIds : null,
      cgi: user?.cgi || false,
    });
  };

  const submitSaveUser = (formData) => onSaveUser(formData);

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
                name="roleCode"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Rol"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={rolesAcls
                      .filter((role) =>
                        watch("otherRoleCodes")
                          ? !watch("otherRoleCodes").includes(role.id)
                          : true
                      )
                      .map((role) => ({
                        label: capitalize(role.name),
                        value: role.id,
                      }))}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="firstName"
                control={control}
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
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="CIP"
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                    disabled={user?.cip}
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
                    disabled={user?.dni}
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
            <Col span={24}>
              <Controller
                name="degree"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Seleccione grado"
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                    options={DegreesArmy}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="commandsIds"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="¿A que comandos pertenece?"
                    mode="multiple"
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                    options={(
                      INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands ||
                      null
                    ).map((command) => ({
                      label: command.name,
                      value: command.id,
                    }))}
                  />
                )}
              />
            </Col>
            <Col span={24}>
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
