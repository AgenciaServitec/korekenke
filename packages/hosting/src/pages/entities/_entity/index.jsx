import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../providers";
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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { capitalize } from "lodash";
import { firestore } from "../../../firebase";

export const EntityIntegration = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { entities, users } = useGlobalData();

  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState({});

  useEffect(() => {
    const _entity =
      entityId === "new"
        ? { id: firestore.collection("entities").doc().id }
        : entities.find((entity) => entity.id === entityId);

    if (!_entity) return navigate(-1);

    setEntity(_entity);
  }, []);

  const mapEntity = (formData) => ({
    ...entity,
    name: formData.name,
    entityManageId: formData.entityManageId,
  });

  const onSubmitSaveEntity = async (formData) => {
    try {
      setLoading(true);
      await firestore
        .collection("entities")
        .doc(entity.id)
        .set(assignCreateProps(mapEntity(formData)));

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
    entityManageId: yup.string().required(),
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
      entityManageId: entity?.entityManageId || null,
    });
  };

  const usersView = users.map((user) => {
    return {
      label: `${capitalize(user.firstName)} ${capitalize(
        user.paternalSurname
      )} ${capitalize(user.maternalSurname)}`,
      value: user.id,
    };
  });

  const submitSaveEntity = (formData) => onSubmitSaveEntity(formData);

  const onGoBack = () => navigate(-1);

  const isNew = entityId === "new";

  return (
    <Acl name={isNew ? "/entities/new" : "/entities/:entityId"} redirect>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Núcleo</Title>
        </Col>
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
                      label="Nombre del Núcleo"
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
                  name="entityManageId"
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
    </Acl>
  );
};
