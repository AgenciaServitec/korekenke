import React, { useEffect } from "react";
import {
  Button,
  Col,
  ComponentContainer,
  Form,
  Input,
  Row,
  Select,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { capitalize, concat, isEmpty, orderBy } from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { findRole, userFullName } from "../../../../utils";

export const EditingUnit = ({
  isNew,
  onGoBack,
  users,
  rolesAcls,
  unit,
  entities,
  departments,
  sections,
  offices,
  loading,
  onSaveUnit,
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

  const membersInEdition = users.filter((user) =>
    !isEmpty(unit?.membersIds) ? unit.membersIds.includes(user.id) : false,
  );

  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    users.filter(
      (user) =>
        isEmpty(user?.assignedTo?.id) && user.roleCode !== "super_admin",
    ),
  ).map(mapOptionSelectMembers);

  const bossesView = (bossId = undefined) =>
    users
      .filter((user) => (watch("membersIds") || []).includes(user.id))
      .filter((user) => (!bossId ? true : user.id !== bossId))
      .map(mapOptionSelectMembers);

  const onChangeMembersWithValidation = (onChange, value) => {
    const _users = users.filter((user) => value.includes(user.id));

    if (_users.length <= 0) {
      setValue("bossId", "");
    }

    return onChange(value);
  };

  const submitSaveUnit = (formData) => onSaveUnit(formData);

  return (
    <Row gutter={[16, 16]}>
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
  );
};
