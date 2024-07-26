import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCommand, useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize, concat, isEmpty, orderBy } from "lodash";
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
  getDepartmentId,
  updateDepartment,
} from "../../../../firebase/collections";
import { findRole, getNameId, userFullName } from "../../../../utils";
import { useUpdateAssignToInUser } from "../../../../hooks/useUpdateAssignToInUser";

export const DepartmentIntegration = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { rolesAcls, departments, entities, departmentUsers, units } =
    useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();
  const { currentCommand } = useCommand();

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({});

  const isNew = departmentId === "new";
  const onGoBack = () => navigate(-1);

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
    nameId: getNameId(formData.name),
    description: formData.description,
    entityId: formData.entityId,
    ...(currentCommand.code === "cologe" && { unitId: formData.unitId }),
    membersIds: formData?.membersIds || [],
    bossId: formData?.bossId || null,
    secondBossId: formData?.secondBossId || null,
  });

  const onSaveDepartment = async (formData) => {
    try {
      setLoading(true);

      //Get users ids deselection
      const usersIdsDeselected = formData?.membersIds
        ? (department?.membersIds || []).filter(
            (memberId) => !formData.membersIds.includes(memberId)
          )
        : [];

      //Update of assignTo of users
      await updateAssignToUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData?.membersIds,
        moduleId: department?.id,
        users: departmentUsers,
      });

      //Update of department
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

  return (
    <Department
      isNew={isNew}
      onGoBack={onGoBack}
      currentCommandCode={currentCommand.code}
      department={department}
      rolesAcls={rolesAcls}
      entities={entities}
      units={units}
      departmentUsers={departmentUsers}
      onSaveDepartment={onSaveDepartment}
      loading={loading}
    />
  );
};

const Department = ({
  isNew,
  onGoBack,
  currentCommandCode,
  department,
  rolesAcls,
  entities,
  units,
  departmentUsers,
  onSaveDepartment,
  loading,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string(),
    entityId: yup.string().required(),
    unitId:
      currentCommandCode === "cologe"
        ? yup.string().required()
        : yup.string().notRequired(),
    membersIds: yup.array().nullable(),
    bossId: yup.string(),
    secondBossId: yup.string(),
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
    defaultValues: {
      membersIds: null,
    },
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
      unitId: department?.unitId || "",
      membersIds: department?.membersIds || null,
      bossId: department?.bossId || "",
      secondBossId: department?.secondBossId || "",
    });
  };

  //VIEWS TO SELECTS
  const mapOptionSelectMembers = (user) => ({
    label: `${userFullName(user)} (${capitalize(
      findRole(rolesAcls, user?.roleCode)?.name || ""
    )})`,
    value: user.id,
    key: user.id,
    roleCode: user.roleCode,
  });

  const membersInEdition = departmentUsers.filter((user) =>
    !isEmpty(department?.membersIds)
      ? department.membersIds.includes(user.id)
      : false
  );

  const userBosses = departmentUsers.filter(
    (user) => user.roleCode === "department_boss"
  );

  //LIST TO SELECTS
  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    departmentUsers.filter(
      (user) =>
        user.assignedTo.type === "department" && isEmpty(user.assignedTo.id)
    )
  ).map(mapOptionSelectMembers);

  const bossesView = (bossId = undefined) =>
    userBosses
      .filter((user) => (watch("membersIds") || []).includes(user.id))
      .filter((user) => (!bossId ? true : user.id !== bossId))
      .map(mapOptionSelectMembers);

  const onChangeMembersWithValidation = (onChange, value) => {
    const _userBosses = userBosses.filter((user) => value.includes(user.id));

    if (_userBosses.length >= 1) {
      setValue("bossId", bossesView(watch("secondBossId"))?.[0]?.value || "");
      setValue("secondBossId", "");
    }

    if (_userBosses.length <= 0) {
      setValue("bossId", "");
      setValue("secondBossId", "");
    }

    return onChange(value);
  };

  const submitSaveDepartment = (formData) => onSaveDepartment(formData);

  return (
    <Acl
      category="administration"
      subCategory="departments"
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
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Entidad"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={entities.map((entity) => ({
                        label: entity.name,
                        value: entity.id,
                      }))}
                    />
                  )}
                />
              </Col>
              {currentCommandCode === "cologe" && (
                <Col span={24}>
                  <Controller
                    name="unitId"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Select
                        label="Unidad"
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                        options={units.map((entity) => ({
                          label: entity.name,
                          value: entity.id,
                        }))}
                      />
                    )}
                  />
                </Col>
              )}
              <Col span={24}>
                <Controller
                  name="membersIds"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Miembros"
                      value={value}
                      onChange={(value) =>
                        onChangeMembersWithValidation(onChange, value)
                      }
                      error={error(name)}
                      required={required(name)}
                      options={orderBy(
                        usersViewForMembers,
                        ["roleCode"],
                        ["desc"]
                      )}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="bossId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Jefe"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={bossesView(watch("secondBossId"))}
                      disabled={isEmpty(watch("membersIds"))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="secondBossId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Segundo Jefe"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={bossesView(watch("bossId"))}
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
