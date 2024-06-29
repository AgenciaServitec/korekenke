import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCommand, useGlobalData } from "../../../../providers";
import {
  Acl,
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize, lowerCase } from "lodash";
import {
  addEntity,
  getEntityId,
  updateEntity,
} from "../../../../firebase/collections";
import { findRole, userFullName } from "../../../../utils";
import { useUpdateAssignToInUser } from "../../../../hooks/useUpdateAssignToInUser";

export const EntityIntegration = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { entities, users, rolesAcls } = useGlobalData();
  const { currentCommand } = useCommand();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState({});

  const isNew = entityId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _entity = isNew
      ? { id: getEntityId() }
      : entities.find((entity) => entity.id === entityId);

    if (!_entity) return navigate(-1);

    setEntity(_entity);
  }, []);

  const mapEntity = (formData) => ({
    ...entity,
    commandId: currentCommand.id,
    name: formData.name,
    abbreviation: lowerCase(formData.abbreviation),
    entityManageId: formData?.entityManageId || null,
  });

  const saveEntity = async (formData) => {
    try {
      setLoading(true);

      const usersEntityManager = users.filter(
        (user) => user.roleCode === "manager"
      );

      //Update of assignTo of users
      await updateAssignToUser({
        oldUsersIds: [
          entity?.entityManageId &&
          formData?.entityManageId !== entity?.entityManageId
            ? entity?.entityManageId
            : null,
        ],
        newUsersIds: [formData.entityManageId],
        moduleId: entity?.id,
        users: usersEntityManager,
      });

      isNew
        ? await addEntity(assignCreateProps(mapEntity(formData)))
        : await updateEntity(entity.id, assignUpdateProps(mapEntity(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveEntity: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Entity
      isNew={isNew}
      entity={entity}
      rolesAcls={rolesAcls}
      users={users}
      loading={loading}
      onSaveEntity={saveEntity}
      onGoBack={onGoBack}
    />
  );
};

const Entity = ({
  isNew,
  entity,
  rolesAcls,
  users,
  loading,
  onSaveEntity,
  onGoBack,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    abbreviation: yup.string(),
    entityManageId: yup.string().nullable(),
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
  }, [entity]);

  const resetForm = () => {
    reset({
      name: entity?.name || "",
      abbreviation: entity?.abbreviation || "",
      entityManageId: entity?.entityManageId || null,
    });
  };

  const commandsViewByUser = (commands) =>
    commands
      .map((command) => command.id)
      .join(" - ")
      .toUpperCase();

  //LIST TO SELECTS
  const usersView = users
    .filter((user) => user.roleCode === "manager")
    .filter((user) => user.assignedTo.type === "entity")
    .map((user) => ({
      label: `${userFullName(user)} (${capitalize(
        findRole(rolesAcls, user?.roleCode)?.name || ""
      )}) (${commandsViewByUser(user?.commands)})`,
      value: user.id,
      key: user.id,
      roleCode: user.roleCode,
    }));

  const submitSaveEntity = (formData) => onSaveEntity(formData);

  return (
    <Acl
      category="administration"
      subCategory="entities"
      name={isNew ? "/entities/new" : "/entities/:entityId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Entidad</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveEntity)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Nombre"
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
                  name="abbreviation"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Siglas"
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
                  name="entityManageId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Gerente"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={usersView}
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
                  disabled={loading}
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
                  loading={loading}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
