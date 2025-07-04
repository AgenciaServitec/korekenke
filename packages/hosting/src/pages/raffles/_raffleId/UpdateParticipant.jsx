import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Title,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { isEmpty } from "lodash";
import {
  addRaffleParticipant,
  getRaffleParticipantId,
  updateRaffleParticipant,
} from "../../../firebase/collections/raffles";
import { useParams } from "react-router";

export const UpdateParticipant = ({ participant = null, onCloseModal }) => {
  const [loading, setLoading] = useState(false);

  const isNew = isEmpty(participant);

  const { raffleId } = useParams();

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const mapParticipant = (data) => {
    const formattedText = (text) => text?.replace(/\s+/g, " ").trim() || "";
    return {
      id: isNew ? getRaffleParticipantId() : participant.id,
      fullName: formattedText(data.fullName),
      dni: formattedText(data.dni),
      phone: {
        number: formattedText(data.phone),
        prefix: "+51",
      },
      status: participant?.status || "approved",
      winner: participant?.winner || false,
    };
  };

  const onSaveParticipant = async (formData) => {
    const parsed = mapParticipant(formData);
    setLoading(true);

    try {
      if (isNew) {
        await addRaffleParticipant(raffleId, assignCreateProps(parsed));
        notification({
          type: "success",
          message: "Participante agregado correctamente",
        });
      } else {
        await updateRaffleParticipant(
          raffleId,
          parsed.id,
          assignUpdateProps(parsed),
        );
        notification({
          type: "success",
          message: "Participante actualizado correctamente",
        });
      }

      onCloseModal();
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        message: "Ocurrió un error al guardar el participante",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UpdateParticipantForm
      isNew={isNew}
      participant={participant}
      loading={loading}
      onCloseModal={onCloseModal}
      onSaveParticipant={onSaveParticipant}
    />
  );
};

const UpdateParticipantForm = ({
  isNew,
  participant,
  loading,
  onCloseModal,
  onSaveParticipant,
}) => {
  const schema = yup.object({
    fullName: yup.string(),
    dni: yup.string(),
    phone: yup.string(),
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
  }, [participant]);

  const resetForm = () => {
    reset({
      fullName: participant?.fullName || "",
      dni: participant?.dni || "",
      phone: participant?.phone.number || "",
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSaveParticipant)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>
            {isNew ? "Agregar participante" : "Editar participante"}
          </Title>
        </Col>
        <Col span={24}>
          <Controller
            name="fullName"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Apellidos y Nombres"
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
            name="dni"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="DNI"
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
            name="phone"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Celular"
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
                {isNew ? "Guardar" : "Actualizar"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
