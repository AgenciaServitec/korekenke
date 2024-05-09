import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize, isEmpty } from "lodash";
import { firestore } from "../../../../firebase";
import {
  Acl,
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Text,
  Title,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addDepartment,
  updateDepartment,
  getDepartmentId,
} from "../../../../firebase/collections";

export const DepartmentIntegration = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { departments, users, entities } = useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({});

  const isNew = departmentId === "new";

  useEffect(() => {
    const _department = isNew
      ? { id: getDepartmentId() }
      : departments.find((department) => department.id === departmentId);

    if (!_department) return navigate(-1);

    setDepartment(_department);
  }, []);

  const mapDepartment = (formData) => ({
    ...department,
    name: formData.name,
    description: formData.description,
    entityId: formData.entityId,
    bossId: formData.bossId,
    secondBossId: formData.secondBossId,
    membersIds: formData.membersIds,
  });

  const onSubmitSaveDepartment = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addDepartment(assignCreateProps(mapDepartment(formData)))
        : await updateDepartment(
            department.id,
            assignUpdateProps(mapDepartment(formData))
          );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveDepartment: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string(),
    entityId: yup.string().required(),
    bossId: yup.string().required(),
    secondBossId: yup.string().required(),
    membersIds: yup.array().required(),
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
  }, [department]);

  const resetForm = () => {
    reset({
      name: department?.name || "",
      description: department?.description || "",
      entityId: department?.entityId || "",
      membersIds: department?.membersIds || [],
      bossId: department?.bossId || null,
      secondBossId: department?.secondBossId || null,
    });
  };

  const entitiesView = entities.map((entity) => {
    return {
      label: entity.name,
      value: entity.id,
    };
  });

  const usersViewForMembers = users
    .map((user) => ({
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
      roleCode: user.defaultRoleCode,
    }))
    .filter((user) =>
      ["department_boss", "assistant_boss_department"].includes(user.roleCode)
    );

  const usersViewForBoss = users
    .map((user) => ({
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
    }))
    .filter((user) => [...(watch("membersIds") || [])].includes(user.value))
    .filter((user) => user.value !== watch("secondBossId"));

  const usersViewForSecondBoss = users
    .map((user) => ({
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
    }))
    .filter((user) => (watch("membersIds") || []).includes(user.value))
    .filter((user) => user.value !== watch("bossId"));

  useEffect(() => {
    if (
      isEmpty(watch("membersIds")) ||
      (watch("membersIds") || []).length < 2
    ) {
      setValue("bossId", "");
      setValue("secondBossId", "");
    }
  }, [watch("membersIds")]);

  const submitSaveDepartment = (formData) => onSubmitSaveDepartment(formData);

  const onGoBack = () => navigate(-1);

  return (
    <Acl
      name={isNew ? "/departments/new" : "/departments/:departmentId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Departamento</Title>
          <Text>
            Crear un departamento para agrupar usuarios. Los departamentos se
            pueden utilizar en lugar de los usuarios para compartir recursos
            como Vistas.
          </Text>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveDepartment)}>
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
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Descripción"
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
                  name="entityId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Entidad (nucleo)"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={entitiesView}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="membersIds"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Miembros"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={usersViewForMembers}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="bossId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Jefe"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={usersViewForBoss}
                      disabled={isEmpty(watch("membersIds"))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="secondBossId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Segundo Jefe"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={usersViewForSecondBoss}
                      disabled={!watch("bossId")}
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
