import React, { useEffect, useState } from "react";
import { useGlobalData } from "../../../providers";
import * as yup from "yup";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  TextArea,
  Title,
  UploadExcel,
} from "../../../components";
import { useNavigate, useParams } from "react-router";
import { addRaffle, getRaffleId } from "../../../firebase/collections/raffles";
import { fetchElection } from "../../../firebase/collections";

export const RaffleIntegration = () => {
  const navigate = useNavigate();
  const { raffleId } = useParams();

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [raffle, setRaffle] = useState({});
  const [loading, setLoading] = useState(false);

  const isNew = raffleId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const _raffle = isNew
        ? { id: getRaffleId() }
        : await fetchElection(raffleId);

      if (!_raffle) return onGoBack();

      setRaffle(_raffle);
    })();
  }, []);

  const mapRaffle = (formData) => ({
    ...raffle,
    title: formData.title,
    group: formData.group,
    description: formData.description,
  });

  const onSubmit = async () => {
    try {
      await addRaffle(assignCreateProps());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <RaffleForm
        isNew={isNew}
        raffle={raffle}
        loading={loading}
        onGoBack={onGoBack}
      />
      <UploadExcel />
    </>
  );
};

const RaffleForm = ({ isNew, raffle, loading, onGoBack }) => {
  const { users } = useGlobalData();

  const schema = yup.object({
    title: yup.string().required(),
    group: yup.string(),
    description: yup.string(),
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
  }, [raffle]);

  const resetForm = () => {
    reset({
      title: raffle?.title || "",
      group: raffle?.group || "",
      description: raffle?.description || "",
    });
  };

  const disabledDate = (current) =>
    current && current <= dayjs().startOf("day");

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>{isNew ? "Nuevo Sorteo" : "Editar Sorteo"}</Title>
      </Col>

      <Col span={24}>
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Título del sorteo"
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
                name="group"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Grupo"
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
                  <TextArea
                    label="Descripción"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    rows={3}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <UploadExcel />
            </Col>
            <Col span={24}>
              <div style={{ margin: "24px 0 16px 0" }}>
                <p style={{ color: "#666", fontStyle: "italic" }}>
                  🚀 Después de guardar el sorteo, podrás agregar candidatos
                  desde la lista de elecciones.
                </p>
              </div>
            </Col>
            <Col span={24}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={24} sm={6} md={4}>
                  <Button
                    type="default"
                    size="large"
                    block
                    onClick={onGoBack}
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
                    {isNew ? "Crear Elección" : "Guardar Cambios"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
