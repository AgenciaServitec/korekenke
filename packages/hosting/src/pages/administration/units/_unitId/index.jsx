import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import {
  Acl,
  Button,
  Col,
  ComponentContainer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import { useNavigate, useParams } from "react-router";
import {
  addUnit,
  getUnitId,
  updateUnit,
} from "../../../../firebase/collections";
import { useCommand, useGlobalData } from "../../../../providers";
import { findRole, getNameId, userFullName } from "../../../../utils";
import { capitalize, concat, isEmpty, orderBy } from "lodash";
import { useUpdateAssignToInUser } from "../../../../hooks/useUpdateAssignToInUser";

export const UnitIntegration = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const {
    entities,
    units,
    departments,
    offices,
    sections,
    rolesAcls,
    unitUsers,
  } = useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();
  const { currentCommand } = useCommand();

  const [loading, setLoading] = useState();
  const [unit, setUnit] = useState({});

  const isNew = unitId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _unit = isNew
      ? { id: getUnitId() }
      : units.find((unit) => unit.id === unitId);

    if (!_unit) return onGoBack();

    setUnit(_unit);
  }, []);

  const mapUnit = (formData) => ({
    ...unit,
    name: formData.name,
    nameId: getNameId(formData.name),
    greatUnit: formData.greatUnit,
    membersIds: formData.membersIds || [],
    bossId: formData.bossId || null,
    commandId: unit?.commandId || currentCommand.id,
    entityId: formData.entityId,
    departmentId: formData.departmentId,
    officeId: formData.officeId,
    sectionId: formData.sectionId,
  });

  const saveUnit = async (formData) => {
    try {
      setLoading(true);

      const usersIdsDeselected = formData?.membersIds
        ? (unit?.membersIds || []).filter(
            (memberId) => !formData.membersIds.includes(memberId),
          )
        : [];

      await updateAssignToUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData?.membersIds,
        moduleId: unit?.id,
        users: unitUsers,
      });

      isNew
        ? await addUnit(assignCreateProps(mapUnit(formData)))
        : await updateUnit(unit.id, assignUpdateProps(mapUnit(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveUnit: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Unit
      isNew={isNew}
      unitUsers={unitUsers}
      unit={unit}
      entities={entities}
      departments={departments}
      offices={offices}
      sections={sections}
      rolesAcls={rolesAcls}
      loading={loading}
      onSaveUnit={saveUnit}
      onGoBack={onGoBack}
    />
  );
};

const Unit = ({
  isNew,
  unitUsers,
  rolesAcls,
  unit,
  entities,
  departments,
  offices,
  sections,
  loading,
  onSaveUnit,
  onGoBack,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    membersIds: yup.array().nullable(),
    bossId: yup.string(),
    entityId: yup.string(),
    departmentId: yup.string(),
    officeId: yup.string(),
    sectionId: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [unit]);

  const resetForm = () => {
    reset({
      name: unit?.name || "",
      membersIds: unit?.membersIds || null,
      bossId: unit?.bossId || "",
      entityId: unit?.entityId || "",
      departmentId: unit?.departmentId || "",
      officeId: unit?.officeId || "",
      sectionId: unit?.sectionId || "",
    });
  };

  const mapOptionSelectMembers = (user) => ({
    label: `${userFullName(user)} (${capitalize(
      findRole(rolesAcls, user?.roleCode)?.name || "",
    )})`,
    value: user.id,
    key: user.id,
    roleCode: user.roleCode,
  });

  const membersInEdition = unitUsers.filter((user) =>
    !isEmpty(unit?.membersIds) ? unit.membersIds.includes(user.id) : false,
  );

  const userBosses = unitUsers.filter((user) => user.roleCode === "unit_boss");

  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    unitUsers.filter(
      (user) => user.assignedTo?.type === "unit" && isEmpty(user.assignedTo.id),
    ),
  ).map(mapOptionSelectMembers);

  const bossesView = (bossId = undefined) =>
    userBosses
      .filter((user) => (watch("membersIds") || []).includes(user.id))
      .filter((user) => (!bossId ? true : user.id !== bossId))
      .map(mapOptionSelectMembers);

  const onChangeMembersWithValidation = (onChange, value) => {
    const _userBosses = userBosses.filter((user) => value.includes(user.id));

    if (_userBosses.length <= 0) {
      setValue("bossId", "");
    }

    return onChange(value);
  };

  const submitSaveUnit = (formData) => onSaveUnit(formData);

  return (
    <Acl
      category="administration"
      subCategory="units"
      name={isNew ? "/units/new" : "/units/:unitId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Unidad</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveUnit)}>
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
                  name="membersIds"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Miembros"
                      name={name}
                      value={value}
                      options={orderBy(
                        usersViewForMembers,
                        ["roleCode"],
                        ["desc"],
                      )}
                      onChange={(value) =>
                        onChangeMembersWithValidation(onChange, value)
                      }
                      error={error(name)}
                      required={required(name)}
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
                      options={bossesView(watch("secondBossId"))}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabled={isEmpty(watch("membersIds"))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <br />
                <ComponentContainer.group label="Vinculación (opcional)">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Controller
                        name="entityId"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Entidad / G.U"
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
                    <Col span={24}>
                      <Controller
                        name="departmentId"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Departamento"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={departments.map((department) => ({
                              label: department.name,
                              value: department.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="officeId"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Officina"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={offices.map((office) => ({
                              label: office.name,
                              value: office.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="sectionId"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Sección"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={sections.map((section) => ({
                              label: section.name,
                              value: section.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </ComponentContainer.group>
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
