import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
  Title,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { useParams } from "react-router";
import {
  addRaffleParticipant,
  getRaffleParticipantId,
} from "../../firebase/collections/raffles";

export const AddParticipants = ({ onCloseModal }) => {
  const { raffleId } = useParams();
  const [loading, setLoading] = useState(false);

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const mapParticipant = (participant) => {
    const part = participant.split(":");
    const formattedText = (part) => part.replace(/\s+/g, " ").trim();
    return {
      id: getRaffleParticipantId(),
      fullName: formattedText(part[0]),
      dni: formattedText(part[1]),
      phone: {
        number: formattedText(part[2]),
        prefix: "+51",
      },
      status: "pending",
      winner: false,
    };
  };

  const onSaveParticipants = async (formData) => {
    try {
      setLoading(true);

      const participants = formData.participants
        .trim()
        .split("\n")
        .map((participant) => assignCreateProps(mapParticipant(participant)));

      for (const participant of participants) {
        await addRaffleParticipant(raffleId, assignCreateProps(participant));
      }

      notification({
        type: "success",
        message: "Se guardo todo los participantes",
      });

      onCloseModal();
    } catch (e) {
      console.error(e);
      notification({
        type: "error",
        message: "No se guardo todo los participantes",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddParticipantsForm
      onSaveParticipants={onSaveParticipants}
      loading={loading}
      onCloseModal={onCloseModal}
    />
  );
};

const AddParticipantsForm = ({ onSaveParticipants, loading, onCloseModal }) => {
  const schema = yup.object({
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
  }, []);

  const resetForm = () => {
    reset({
      participants: "",
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSaveParticipants)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Agregar participantes</Title>
        </Col>
        <Col span={24}>
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
                placeholder="apellidos nombres:dni:celular"
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onCloseModal()}
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
        </Col>
      </Row>
    </Form>
  );
};
