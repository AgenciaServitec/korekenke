import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firestore } from "../../../firebase";
import { querySnapshotToArray } from "../../../firebase/firestore";
import { acls } from "../../../data-list";
import { useNavigate } from "react-router-dom";
import {
  useAsync,
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../hooks";
import { capitalize, difference, isArray, isObject, union } from "lodash";
import {
  Acl,
  Button,
  CheckboxGroup,
  Col,
  ComponentContainer,
  Form,
  modalConfirm,
  notification,
  RadioGroup,
  Row,
  Select,
  Title,
} from "../../../components";
import { mapAcls } from "../../../utils";
import { useGlobalData } from "../../../providers";
import { usersRef } from "../../../firebase/collections";

const ACTION = {
  add: {
    id: "add",
    label: "Agregar ACL",
    setAcls: union,
    message: {
      confirm: "¿Está seguro de agregar los acl(s)?",
    },
  },
  remove: {
    id: "remove",
    label: "Eliminar ACL",
    setAcls: difference,
    message: {
      confirm: "Estás seguro de eliminar los acl(s)?",
    },
  },
};

export const ManageAclsIntegration = () => {
  const navigate = useNavigate();
  const { rolesAcls } = useGlobalData();

  const { assignUpdateProps } = useDefaultFirestoreProps();

  const {
    run: updateUsersAcls,
    loading: isSavingUsersAcls,
    error: errorUsersAcls,
    success: isSuccessUsersAcls,
  } = useAsync(async (currentAction, formData) => {
    const users = await fetchUsers(formData);

    const batch = firestore.batch();

    users
      .map((user) => mapUser(user, formData, currentAction))
      .forEach((user) =>
        batch.update(
          firestore.collection("users").doc(user.id),
          assignUpdateProps(user),
        ),
      );

    return await batch.commit();
  });

  const fetchUsers = async (formData) => {
    const usersQuerySnapshot = await usersRef
      .where("isDeleted", "==", false)
      .where("roleCode", "==", formData.roleCode)
      .get();

    return querySnapshotToArray(usersQuerySnapshot);
  };

  const mapUser = (user, formData, currentAction) => {
    const userAcl = isArray(user?.acls) ? {} : user?.acls || {};

    Object.entries(formData.acls).map(([key, subCategories = {}]) => {
      if (!userAcl?.[key]) {
        userAcl[key] = {};
      }

      Object.entries(subCategories).map(([_key, values = []]) => {
        if (!userAcl[key]?.[_key]) {
          userAcl[key][_key] = [];
        }

        userAcl[key][_key] = currentAction.setAcls(userAcl[key][_key], values);
      });
    });

    return { ...user, acls: userAcl };
  };

  useEffect(() => {
    errorUsersAcls && notification({ type: "error" });
  }, [errorUsersAcls]);

  useEffect(() => {
    isSuccessUsersAcls &&
      notification({
        type: "success",
        title: "Acls de usuarios actualizado exitosamente!",
      });
  }, [isSuccessUsersAcls]);

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <ManageAcls
      rolesAcls={rolesAcls}
      onUpdateUsersAcls={updateUsersAcls}
      isSavingUsersAcls={isSavingUsersAcls}
      onCancel={onCancel}
    />
  );
};

const ManageAcls = ({
  rolesAcls = [],
  onUpdateUsersAcls,
  isSavingUsersAcls,
  onCancel,
}) => {
  const schema = yup.object({
    roleCode: yup.string().required(),
    actionId: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitManageAcl = (formData) => {
    const currentAction = ACTION[formData.actionId];

    modalConfirm({
      title: currentAction.message.confirm,
      content: "Todos los datos serán modificados",
      onOk: () => onUpdateUsersAcls(currentAction, formData),
    });
  };

  const resetForm = () => {
    const aclsDefault = {};

    Object.entries(acls).forEach(([key, subCategories = {}]) => {
      aclsDefault[key] = {};
      Object.keys(subCategories).forEach(
        (_key) => (aclsDefault[key][_key] = []),
      );
    });

    reset({
      acls: aclsDefault,
      actionId: undefined,
      roleCode: undefined,
    });

    window.scrollTo(0, 0);

    notification({
      type: "success",
      title: "¡Reseteo de formulario exito!",
      duration: 2,
    });
  };

  const resetAcls = () => {
    Object.entries(acls).forEach(([key, subCategories = {}]) => {
      Object.keys(subCategories).forEach((_key) =>
        setValue(`acls.${key}.${_key}`, false),
      );
    });

    window.scrollTo(0, 0);

    notification({
      type: "success",
      title: "¡Reseteo de Acls exito!",
      duration: 2,
    });
  };

  const getAclsByRoleCode = (roleCode) => {
    const roleAcl = rolesAcls.find((roleAcl) => roleAcl.id === roleCode);

    reset({
      acls: roleAcl?.acls ? mapAcls(roleAcl.acls) : {},
      actionId: watch("actionId"),
      roleCode: watch("roleCode"),
    });
  };

  useEffect(() => {
    watch("roleCode") && getAclsByRoleCode(watch("roleCode"));
  }, [watch("roleCode")]);

  return (
    <Acl
      redirect
      category="accessControl"
      subCategory="manageAcls"
      name="/manage-acls"
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Administrador Acls</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSubmitManageAcl)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="actionId"
                  defaultValue={undefined}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <RadioGroup
                      label="Acción"
                      options={Object.values(ACTION).map((action) => ({
                        label: action.label,
                        value: action.id,
                      }))}
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      helperText={errorMessage(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="roleCode"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Rol"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      helperText={errorMessage(name)}
                      required={required(name)}
                      options={rolesAcls.map((role) => ({
                        label: capitalize(role.name),
                        value: role.id,
                      }))}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={24}>
                <Title level={4}>Privilegios de usuario</Title>
              </Col>
              {Object.entries(acls).map(([keyCategory, subCategories]) => (
                <Col span={24} key={keyCategory}>
                  {/*{keyCategory === "jefatura-de-bienestar-del-ejercito" && (*/}
                  {/*  <>*/}
                  {/*    <h5>Entidades:</h5>*/}
                  {/*    <br />*/}
                  {/*  </>*/}
                  {/*)}*/}
                  <ComponentContainer.group label={subCategories.label}>
                    <Row gutter={[16, 16]}>
                      {Object.entries(subCategories).map(
                        ([keySubCategory, items]) => {
                          const unlabeledAclsForSelectOptions =
                            isObject(items) &&
                            Object.entries(items).filter(
                              (_item) =>
                                !_item.includes("label") &&
                                !_item.includes("command"),
                            );

                          return (
                            keySubCategory !== "label" &&
                            keySubCategory !== "command" && (
                              <Col span={24} key={keySubCategory}>
                                <Controller
                                  name={`acls.${keyCategory}.${keySubCategory}`}
                                  defaultValue={undefined}
                                  control={control}
                                  render={({
                                    field: { onChange, value, name },
                                  }) => (
                                    <CheckboxGroup
                                      label={items.label}
                                      options={unlabeledAclsForSelectOptions.map(
                                        (_item) => ({
                                          label: _item[1],
                                          value: _item[0],
                                        }),
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
                            )
                          );
                        },
                      )}
                    </Row>
                  </ComponentContainer.group>
                </Col>
              ))}
            </Row>
            <Row justify="start" gutter={[16, 16]}>
              <Col xs={24} sm={6} md={4}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  block
                  loading={isSavingUsersAcls}
                >
                  Guardar
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button
                  size="large"
                  block
                  onClick={() => onCancel()}
                  disabled={isSavingUsersAcls}
                >
                  Cancelar
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button size="large" danger block onClick={() => resetAcls()}>
                  Resetear solo Acls
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button size="large" danger block onClick={() => resetForm()}>
                  Resetear todos
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
