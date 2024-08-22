import React, { useEffect } from "react";
import {
  Button,
  Col,
  ComponentContainer,
  Form,
  Input,
  Row,
  Select,
  Text,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { capitalize, concat, isEmpty, orderBy } from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { findRole, userFullName } from "../../../../utils";

export const EditingDepartment = ({
  isNew,
  onGoBack,
  users,
  rolesAcls,
  department,
  entities,
  units,
  sections,
  offices,
  loading,
  onSaveDepartment,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string(),
    membersIds: yup.array().nullable(),
    bossId: yup.string(),
    secondBossId: yup.string(),
    entityId: yup.string(),
    unitId: yup.string(),
    officeId: yup.string(),
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
      membersIds: department?.membersIds || null,
      bossId: department?.bossId || "",
      secondBossId: department?.secondBossId || "",
      entityId: department?.entityId || "",
      unitId: department?.unitId || "",
      officeId: department?.officeId || "",
      sectionId: department?.sectionId || "",
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
    !isEmpty(department?.membersIds)
      ? department.membersIds.includes(user.id)
      : false,
  );

  //LIST TO SELECTS
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
    const _userBosses = users.filter((user) => value.includes(user.id));

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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Text>
          Crear un departamento para agrupar usuarios. Los departamentos se
          pueden utilizar en lugar de los usuarios para compartir recursos como
          Vistas.
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
                      ["desc"],
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
