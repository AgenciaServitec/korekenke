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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { findRole, userFullName } from "../../../../utils";
import { capitalize, concat, isEmpty } from "lodash";

export const EditingOffice = ({
  isNew,
  onGoBack,
  users,
  rolesAcls,
  office,
  entities,
  units,
  departments,
  sections,
  loading,
  onSaveOffice,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string(),
    membersIds: yup.array().nullable(),
    bossId: yup.string(),
    entityId: yup.string(),
    departmentId: yup.string(),
    unitId: yup.string(),
    sectionId: yup.string(),
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
  }, [office]);

  const resetForm = () => {
    reset({
      name: office?.name || "",
      description: office?.description || "",
      membersIds: office?.membersIds || null,
      bossId: office?.bossId || "",
      entityId: office?.entityId || "",
      departmentId: office?.departmentId || "",
      unitId: office?.unitId || "",
      sectionId: office?.sectionId || "",
    });
  };

  //VIEWS TO SELECTS
  const mapOptionSelectMembers = (user) => ({
    label: `${userFullName(user)} (${capitalize(
      findRole(rolesAcls, user?.roleCode)?.name || "",
    )})`,
    value: user.id,
    key: user.id,
    roleCode: user.roleCode,
  });

  const membersInEdition = users.filter((user) =>
    !isEmpty(office?.membersIds) ? office.membersIds.includes(user.id) : false,
  );

  //LIST TO SELECTS
  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    users.filter(
      (user) =>
        isEmpty(user?.assignedTo?.id) && user.roleCode !== "super_admin",
    ),
  ).map(mapOptionSelectMembers);

  const bossesView = () =>
    users
      .filter((user) => (watch("membersIds") || []).includes(user.id))
      .map(mapOptionSelectMembers);

  const onChangeMembersWithValidation = (onChange, value) => {
    const _users = users.filter((user) => value.includes(user.id));

    if (_users.length > 0) {
      setValue("bossId", _users?.[0]?.id || "");
    }

    if (_users.length <= 0) {
      setValue("bossId", "");
    }

    return onChange(value);
  };

  const submitSaveOffice = (formData) => onSaveOffice(formData);

  return (
    <Row>
      <Col span={24}>
        <Form onSubmit={handleSubmit(submitSaveOffice)}>
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
                    options={usersViewForMembers}
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
                    options={bossesView()}
                    disabled={!watch("membersIds")}
                  />
                )}
              />
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
                        name="unitId"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Unidad"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={units.map((unit) => ({
                              label: unit.name,
                              value: unit.id,
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
