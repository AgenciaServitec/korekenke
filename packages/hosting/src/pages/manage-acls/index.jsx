import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firestore } from "../../firebase";
import { querySnapshotToArray } from "../../firebase/firestore";
import { acls, allRoles } from "../../data-list";
import { useNavigate } from "react-router-dom";
import { useAsync, useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { capitalize, difference, flatten, map, union } from "lodash";
import {
  Acl,
  Button,
  CheckboxGroup,
  Form,
  modalConfirm,
  notification,
  RadioGroup,
  Select,
  Title,
} from "../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { filterAcl } from "../../utils";

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

  const { assignUpdateProps } = useDefaultFirestoreProps();

  const {
    run: updateUsersAcls,
    loading: isSavingUsersAcls,
    error: errorUsersAcls,
    success: isSuccessUsersAcls,
  } = useAsync(async (currentAction, formData) => {
    const users = await fetchUser(formData);

    const batch = firestore.batch();

    users
      .map((user) => mapUser(user, formData, currentAction))
      .forEach((user) =>
        batch.update(
          firestore.collection("users").doc(user.id),
          assignUpdateProps(user)
        )
      );

    return await batch.commit();
  });

  const fetchUser = async (formData) => {
    const usersQuerySnapshot = await firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("defaultRoleCode", "==", formData.roleCode)
      .get();

    return querySnapshotToArray(usersQuerySnapshot);
  };

  const mapUser = (user, formData, currentAction) => {
    const userAcl = user.acls;
    const formDataAcl = flatten(
      map(formData.acls, (acl) => acl).filter((acl) => acl)
    );

    user.acls = currentAction.setAcls(userAcl, formDataAcl);

    return user;
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
      onUpdateUsersAcls={updateUsersAcls}
      isSavingUsersAcls={isSavingUsersAcls}
      onCancel={onCancel}
    />
  );
};

const ManageAcls = ({ onUpdateUsersAcls, isSavingUsersAcls, onCancel }) => {
  const schema = yup.object({
    roleCode: yup.string().required(),
    actionId: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
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

    Object.keys(acls).forEach((aclKey) => (aclsDefault[aclKey] = []));

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

  return (
    <Acl redirect name="/manage-acls">
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
                      options={allRoles.map((role) => ({
                        label: capitalize(role.name),
                        value: role.code,
                      }))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Title level={4}>Privilegios de usuario</Title>
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
              <Col span={24}>
                <Controller
                  name="acls.defaultRolesAcls"
                  defaultValue={[]}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <CheckboxGroup
                      label="Acls de roles predeterminados"
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
                      label="Administrador Acls"
                      options={map(
                        filterAcl("manage-acls"),
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
                <Button size="large" danger block onClick={() => resetForm()}>
                  Resetear
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};