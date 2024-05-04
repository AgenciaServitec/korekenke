import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { capitalize } from "lodash";
import { firestore } from "../../../firebase";
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
} from "../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export const DepartmentIntegration = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { departments, users, entities } = useGlobalData();

  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({});

  useEffect(() => {
    const _department =
      departmentId === "new"
        ? { id: firestore.collection("departments").doc().id }
        : departments.find((department) => department.id === departmentId);

    if (!_department) return navigate(-1);

    setDepartment(_department);
  }, []);

  const mapDepartment = (formData) => ({
    ...department,
    name: formData.name,
    entityManageId: formData.entityManageId,
    entityId: formData.entityId,
    departmentManageId: formData.departmentManageId,
    secondDepartmentManageId: formData.secondDepartmentManageId,
    assistantsIds: formData.assistantsIds,
  });

  const onSubmitSaveDepartment = async (formData) => {
    try {
      setLoading(true);
      await firestore
        .collection("departments")
        .doc(department.id)
        .set(assignCreateProps(mapDepartment(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveEntity: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const schema = yup.object({
    name: yup.string().required(),
    entityId: yup.string().required(),
    departmentManageId: yup.string().required(),
    secondDepartmentManageId: yup.string().required(),
    assistantsIds: yup.array().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
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
      entityId: department?.entityId || "",
      departmentManageId: department?.departmentManageId || null,
      secondDepartmentManageId: department?.secondDepartmentManageId || null,
      assistantsIds: department?.assistantsIds || [],
    });
  };

  const entitiesView = entities.map((entity) => {
    return {
      label: entity.name,
      value: entity.id,
    };
  });

  const userView = users.map((user) => ({
    label: `${capitalize(user.firstName)} ${capitalize(
      user.paternalSurname
    )} ${capitalize(user.maternalSurname)}`,
    value: user.id,
  }));

  const submitSaveDepartment = (formData) => onSubmitSaveDepartment(formData);

  const onGoBack = () => navigate(-1);

  const isNew = departmentId === "new";

  return (
    <Acl
      name={isNew ? "/departments/new" : "/departments/:departmentId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Departamentos</Title>
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
                      label="Nombre del Departamento"
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
                      label="Núcleo"
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
                  name="departmentManageId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Jefe del Departamento"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={userView}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="secondDepartmentManageId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Segundo Jefe del Departamento"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={userView.filter(
                        (user) => user.value !== watch("departmentManageId")
                      )}
                      disabled={!watch("departmentManageId")}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="assistantsIds"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Asistentes del Departamento"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={userView}
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
