import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize } from "lodash";
import { firestore } from "../../../../firebase";
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

export const OfficeIntegration = () => {
  const { officeId } = useParams();
  const navigate = useNavigate();
  const { offices, users, sections } = useGlobalData();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState({});

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const _office =
          officeId === "new"
            ? {
                id: firestore.collection("offices").doc().id,
              }
            : offices.find((office) => office.id === officeId);

        if (!_office) navigate(-1);

        setOffice(_office);
      } catch (error) {
        console.error("Error fetching office:", error);
      }
    };

    fetchOffice();
  }, [officeId, navigate, offices]);

  const mapOffice = (formData) => ({
    ...office,
    name: formData.name,
    description: formData.description,
    officeManagerId: formData.officeManagerId,
    assistantsIds: formData.assistantsIds,
    sectionId: formData.sectionId,
  });

  const onSubmitSaveOffice = async (formData) => {
    try {
      setLoading(true);
      await firestore
        .collection("offices")
        .doc(office.id)
        .set(assignCreateProps(mapOffice(formData)));

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
    officeManagerId: yup.string().required(),
    assistantsIds: yup.array().required(),
    sectionId: yup.string().required(),
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
      officeManagerId: office?.officeManagerId || "",
      assistantsIds: office?.assistantsIds || [],
      sectionId: office?.sectionId || "",
    });
  };

  const usersView = users.map((user) => ({
    label: `${capitalize(user.firstName)} ${capitalize(
      user.paternalSurname
    )} ${capitalize(user.maternalSurname)}`,
    value: user.id,
  }));

  const sectionsView = sections.map((section) => ({
    label: section.name,
    value: section.id,
  }));

  const submitSaveOffice = (formData) => onSubmitSaveOffice(formData);

  const onGoBack = () => navigate(-1);

  const isNew = officeId === "new";

  return (
    <Acl name={isNew ? "/offices/new" : "/offices/:officeId"} redirect>
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
                      label="Nombre de la Oficina"
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
                  name="officeManagerId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Gerente de la Oficina"
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
                  name="assistantsIds"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Asistentes de la Oficina"
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
