import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import {
  Acl,
  Button,
  Col,
  ComponentContainer,
  Form,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateModuleAdministrator } from "../../../../firebase/collections";

export const ModuleAdministratorIntegration = () => {
  const { moduleAdministratorId } = useParams();
  const navigate = useNavigate();
  const {
    modulesAdministrator,
    entities,
    departments,
    units,
    sections,
    offices,
  } = useGlobalData();
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [moduleAdministrator, setModuleAdministrator] = useState({});

  const globalData = { entities, departments, units, sections, offices };
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _moduleAdministrator = modulesAdministrator.find(
      (module) => module?.id === moduleAdministratorId,
    );

    if (!_moduleAdministrator) return onGoBack();

    setModuleAdministrator(_moduleAdministrator);
  }, []);

  const mapModuleAdministrator = (formData) => ({
    ...moduleAdministrator,
    entitiesIds: formData?.entitiesIds || [],
    departmentsIds: formData?.departmentsIds || [],
    unitsIds: formData?.unitsIds || [],
    sectionsIds: formData?.sectionsIds || [],
    officesIds: formData?.officesIds || [],
  });

  const saveModuleAdministrator = async (formData) => {
    try {
      setLoading(true);

      await updateModuleAdministrator(
        moduleAdministrator.id,
        assignUpdateProps(mapModuleAdministrator(formData)),
      );

      notification({ type: "success" });
      onGoBack();
    } catch (error) {
      console.error("Error saving moduleAdministrator:", error);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleAdministrator
      moduleAdministrator={moduleAdministrator}
      globalData={globalData}
      onSaveModuleAdministrator={saveModuleAdministrator}
      onGoBack={onGoBack}
      loading={loading}
    />
  );
};

const ModuleAdministrator = ({
  moduleAdministrator,
  globalData,
  onSaveModuleAdministrator,
  onGoBack,
  loading,
}) => {
  const schema = yup.object({
    entitiesIds: yup.array().nullable(),
    departmentsIds: yup.array().nullable(),
    unitsIds: yup.array().nullable(),
    sectionsIds: yup.array().nullable(),
    officesIds: yup.array().nullable(),
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
  }, [moduleAdministrator]);

  const resetForm = () => {
    reset({
      entitiesIds: moduleAdministrator?.entitiesIds || null,
      departmentsIds: moduleAdministrator?.departmentsIds || null,
      unitsIds: moduleAdministrator?.unitsIds || null,
      sectionsIds: moduleAdministrator?.sectionsIds || null,
      officesIds: moduleAdministrator?.officesIds || null,
    });
  };

  const submitSaveOffice = (formData) => onSaveModuleAdministrator(formData);

  return (
    <Acl
      category="accessControl"
      subCategory="modulesAdministrator"
      name="/modules-administrator/:moduleAdministratorId"
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Módulo: {moduleAdministrator?.name}</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveOffice)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <br />
                <ComponentContainer.group label="Grupos con permisos para este modulo">
                  <Row gutter={[16, 34]}>
                    <Col span={24}>
                      <Controller
                        name="entitiesIds"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Entidades / G.U"
                            mode="multiple"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={globalData.entities.map((entity) => ({
                              label: entity.name,
                              value: entity.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="departmentsIds"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Departamentos"
                            mode="multiple"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={globalData.departments.map(
                              (department) => ({
                                label: department.name,
                                value: department.id,
                              }),
                            )}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="unitsIds"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Unidades"
                            mode="multiple"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={globalData.units.map((unit) => ({
                              label: unit.name,
                              value: unit.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="sectionsIds"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Secciones"
                            mode="multiple"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={globalData.sections.map((section) => ({
                              label: section.name,
                              value: section.id,
                            }))}
                          />
                        )}
                      />
                    </Col>
                    <Col span={24}>
                      <Controller
                        name="officesIds"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            label="Oficinas"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            options={globalData.offices.map((section) => ({
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
