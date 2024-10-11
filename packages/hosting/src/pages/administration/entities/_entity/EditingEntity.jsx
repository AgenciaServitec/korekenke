import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { commandsViewByUser, findRole, userFullName } from "../../../../utils";
import { capitalize } from "lodash";

export const EditingEntityGU = ({
  entity,
  users,
  rolesAcls,
  loading,
  onSaveEntity,
  onGoBack,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    abbreviation: yup.string(),
    managerId: yup.string().nullable(),
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
      managerId: entity?.managerId || null,
    });
  };

  //LIST TO SELECTS
  const usersView = users.map((user) => ({
    label: `${userFullName(user)} ${
      findRole(rolesAcls, user?.roleCode)?.name
        ? `(${capitalize(findRole(rolesAcls, user?.roleCode)?.name || "")}) (${commandsViewByUser(user?.commands)})`
        : ""
    }`,
    value: user.id,
    key: user.id,
    roleCode: user.roleCode,
  }));

  const submitSaveEntity = (formData) => onSaveEntity(formData);

  return (
    <Row>
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
                name="managerId"
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
  );
};
