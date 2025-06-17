import React, { useEffect, useRef } from "react";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateVisit } from "../../firebase/collections";
import {
  Button,
  Form,
  notification,
  TextArea,
  Col,
  Row,
  Tag,
} from "../../components";
import { useAuthentication } from "../../providers";
import { v4 as uuidv4 } from "uuid";
import { userFullName } from "../../utils/users/userFullName2";
import styled from "styled-components";

export const VisitedObservation = ({ visit, onCloseModal }) => {
  const { authUser } = useAuthentication();
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const visited = visit.userId === authUser.id;

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [visit.observations]);

  const schema = yup.object({
    observationMessage: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, errorMessage, required } = useFormUtils({ errors, schema });

  const resetForm = () => {
    reset({
      observationMessage: "",
    });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const onSubmit = async (formData) => {
    const newObservation = {
      id: uuidv4(),
      message: formData.observationMessage,
      user: {
        paternalSurname: userFullName(authUser),
        commandId: authUser?.initialCommand?.id,
        visited,
      },
      createdAt: new Date().toISOString(),
    };

    const updatedVisit = {
      ...visit,
      observations: [...(visit.observations || []), newObservation],
    };

    try {
      await updateVisit(updatedVisit.id, assignUpdateProps(updatedVisit));
      notification({ type: "success" });
      onCloseModal();
    } catch (error) {
      notification({ type: "error" });
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            control={control}
            name="observationMessage"
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Observación"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
      </Row>

      <ObservationsContainer ref={scrollRef}>
        {(visit.observations || []).map((obs) => (
          <MessageBubble key={obs.id} visited={obs.user.visited}>
            <div className="user-info">
              <strong>{obs.user.paternalSurname}</strong>
              {obs.user.visited && <Tag color="green">Visitado</Tag>}
              <Tag color="blue">{obs.user.commandId}</Tag>
            </div>
            <p style={{ marginBottom: 4 }}>{obs.message}</p>
          </MessageBubble>
        ))}
      </ObservationsContainer>

      <Row justify="end" gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" size="large" block htmlType="submit">
            Guardar observación
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button type="default" size="large" block onClick={onCloseModal}>
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const ObservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 16px;
  max-height: 37em;
  overflow-y: auto;
  padding: 1em;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #ffffff;
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 100%;
  background-color: ${({ visited }) => (visited ? "#e6fffb" : "#fafafa")};
  border: 1px solid #d9d9d9;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;
