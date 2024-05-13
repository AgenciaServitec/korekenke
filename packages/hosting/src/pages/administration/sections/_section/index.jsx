import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
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
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize, isEmpty } from "lodash";
import {
  addSection,
  getSectionId,
  updateSection,
} from "../../../../firebase/collections";

export const SectionIntegration = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { departments, sections, users } = useGlobalData();
  const { assignUpdateProps, assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState({});

  const isNew = sectionId === "new";

  useEffect(() => {
    const _section = isNew
      ? { id: getSectionId() }
      : sections.find((section) => section.id === sectionId);

    if (!_section) return navigate(-1);

    setSection(_section);
  }, []);

  const mapSection = (formData) => ({
    ...section,
    name: formData.name,
    departmentId: formData.departmentId,
    membersIds: formData.membersIds,
    bossId: formData.bossId,
  });

  const onSubmitSaveSection = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addSection(assignCreateProps(mapSection(formData)))
        : await updateSection(
            section.id,
            assignUpdateProps(mapSection(formData))
          );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveSection: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const schema = yup.object({
    name: yup.string().required(),
    departmentId: yup.string().required(),
    bossId: yup.string().required(),
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
  }, [section]);

  const resetForm = () => {
    reset({
      name: section?.name || "",
      departmentId: section?.departmentId || null,
      bossId: section?.bossId || null,
      membersIds: section?.membersIds || null,
    });
  };

  const usersViewForMembers = users
    .map((user) => ({
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
      roleCode: user.roleCode,
    }))
    .filter((user) =>
      ["section_boss", "assistant_boss_section"].includes(user.roleCode)
    );

  const usersViewForBoss = users
    .map((user) => ({
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
      roleCode: user.roleCode,
    }))
    .filter((user) => (watch("membersIds") || []).includes(user.value));

  const departmentsView = departments.map((department) => {
    return {
      label: department.name,
      value: department.id,
    };
  });

  useEffect(() => {
    if (
      isEmpty(watch("membersIds")) ||
      (watch("membersIds") || []).length < 2
    ) {
      setValue("bossId", null);
    }
  }, [watch("membersIds")]);

  const submitSaveSection = (formData) => onSubmitSaveSection(formData);

  const onGoBack = () => navigate(-1);

  return (
    <Acl name={isNew ? "/sections/new" : "/sections/:sectionId"} redirect>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Sección</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveSection)}>
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
                  name="departmentId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Departamento"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={departmentsView}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="membersIds"
                  control={control}
                  defaultValue={null}
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
                      disabled={!watch("membersIds")}
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
