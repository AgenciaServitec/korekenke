import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize } from "lodash";
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
import {
  addOffice,
  getOfficeId,
  updateOffice,
} from "../../../../firebase/collections";
import { findRole } from "../../../../utils";

export const OfficeIntegration = () => {
  const { officeId } = useParams();
  const navigate = useNavigate();
  const { offices, users, sections, rolesAcls } = useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState({});
  const isNew = officeId === "new";

  useEffect(() => {
    const _office = isNew
      ? { id: getOfficeId() }
      : offices.find((office) => office.id === officeId);

    if (!_office) navigate(-1);

    setOffice(_office);
  }, []);

  const mapOffice = (formData) => ({
    ...office,
    name: formData.name,
    description: formData.description,
    sectionId: formData.sectionId,
    membersIds: formData.membersIds,
    bossId: formData.bossId,
  });

  const onSubmitSaveOffice = async (formData) => {
    try {
      isNew
        ? await addOffice(assignCreateProps(mapOffice(formData)))
        : await updateOffice(office.id, assignUpdateProps(mapOffice(formData)));

      notification({ type: "success" });
      onGoBack();
    } catch (error) {
      console.error("Error saving office:", error);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string().required(),
    sectionId: yup.string().required(),
    membersIds: yup.array().required(),
    bossId: yup.string().required(),
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
  }, [office]);

  const resetForm = () => {
    reset({
      name: office?.name || "",
      description: office?.description || "",
      sectionId: office?.sectionId || "",
      membersIds: office?.membersIds || null,
      bossId: office?.bossId || "",
    });
  };

  const sectionsView = sections.map((section) => ({
    label: section.name,
    value: section.id,
  }));

  const usersView = users.map((user) => ({
    label: `${capitalize(user.firstName)} ${capitalize(
      user.paternalSurname
    )} ${capitalize(user.maternalSurname)} (${capitalize(
      findRole(rolesAcls, user?.roleCode)?.name || ""
    )})`,
    value: user.id,
  }));

  const submitSaveOffice = (formData) => onSubmitSaveOffice(formData);

  const onGoBack = () => navigate(-1);

  return (
    <Acl
      category="administration"
      subCategory="offices"
      name={isNew ? "/offices/new" : "/offices/:officeId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Oficina</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(submitSaveOffice)}>
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
                  name="sectionId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Sección"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={sectionsView}
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
                      options={usersView}
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
    </Acl>
  );
};
