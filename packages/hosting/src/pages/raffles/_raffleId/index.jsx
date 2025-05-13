import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import {
  Acl,
  Button,
  Col,
  Form,
  IconAction,
  Input,
  notification,
  Row,
  Space,
  TextArea,
  Title,
} from "../../../components";
import { useNavigate, useParams } from "react-router";
import {
  addParticipant,
  addRaffle,
  fetchRaffle,
  getRaffleId,
  raffleParticipantsRef,
  updateRaffle,
} from "../../../firebase/collections/raffles";
import { useAuthentication } from "../../../providers";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { isEmpty } from "lodash";

export const RaffleIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();
  const { raffleId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [participants = [], participantsLoading, participantsError] =
    useCollectionData(
      raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
    );

  const [raffle, setRaffle] = useState({});
  const [loading, setLoading] = useState(false);

  const isNew = raffleId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const _raffle = isNew
        ? { id: getRaffleId() }
        : await fetchRaffle(raffleId);

      if (!_raffle) return onGoBack();

      setRaffle(_raffle);
    })();
  }, []);

  const mapRaffle = (formData) => ({
    ...raffle,
    title: formData.title,
    group: formData.group,
    quantityParticipants: formData.participants.split("\n").length,
    userId: authUser?.id,
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const participants = formData.participants.split("\n").map((par) => ({
        nombres: par.split(":")[0],
        dni: par.split(":")[1],
        celular: par.split(":")[2],
      }));

      isNew
        ? await addRaffle(assignCreateProps(mapRaffle(formData)))
        : await updateRaffle(raffle.id, assignUpdateProps(mapRaffle(formData)));

      await participants.forEach(
        async (participant) =>
          await addParticipant(raffle.id, assignCreateProps(participant)),
      );

      notification({ type: "success", message: "Se guardó correctamente." });
      onGoBack();
    } catch (e) {
      console.error(e);
      notification({ type: "error", message: "No se guardó correctamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Acl
      category="public"
      subCategory="raffles"
      name={isNew ? "/raffles/new" : "/raffles/:raffleId"}
      redirect
    >
      <RaffleForm
        isNew={isNew}
        raffle={raffle}
        participants={participants}
        loading={loading}
        onSubmit={onSubmit}
        onGoBack={onGoBack}
      />
    </Acl>
  );
};

const RaffleForm = ({
  isNew,
  raffle,
  participants,
  loading,
  onSubmit,
  onGoBack,
}) => {
  const schema = yup.object({
    title: yup.string(),
    group: yup.string(),
    participants: yup.string(),
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
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>{isNew ? "Nuevo Sorteo" : "Editar Sorteo"}</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                name="winners"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Ganadores"
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
                name="durationSeconds"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Duración en segundos"
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
              {isEmpty(participants) ? (
                <Controller
                  name="participants"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <TextArea
                      label="Participantes"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      rows={10}
                      placeholder="nombres:dni:celular"
                    />
                  )}
                />
              ) : (
                <Button danger type="primary" onClick={() => ""}>
                  Participantes ({participants.length})
                </Button>
              )}
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
                    {isNew ? "Crear Sorteo" : "Guardar Cambios"}
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
