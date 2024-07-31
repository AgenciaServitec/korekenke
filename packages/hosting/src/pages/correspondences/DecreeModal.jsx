import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  RadioGroup,
  Row,
  TextArea,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { updateCorrespondence } from "../../firebase/collections";
import { DecreeList } from "../../data-list";

export const DecreeModal = ({ correspondence, onCloseDecreeModal }) => {
  const { assignUpdateProps, assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const schema = yup.object({
    decreeId: yup.string().required(),
    priority: yup.string().required(),
    observation: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const decreeMap = (formData) => ({
    decreeId: formData.decreeId,
    priority: formData.priority,
    observation: formData.observation,
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await updateCorrespondence(
        correspondence.id,
        assignUpdateProps({
          decree: assignCreateProps(decreeMap(formData)),
          status: "pending",
        }),
      );

      onCloseDecreeModal();
      notification({
        type: "success",
        title: "El decreto ha sido realizado exitosamente",
      });
    } catch (e) {
      console.error(e);
      notification({ type: "error", message: "Error al decretar" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="decreeId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <RadioGroup
                label="Tipo de decreto"
                name={name}
                value={value}
                onChange={onChange}
                options={DecreeList.map((decree) => ({
                  label: decree.name,
                  value: decree.id,
                }))}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            name="priority"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <RadioGroup
                label="Prioridad"
                name={name}
                value={value}
                onChange={onChange}
                options={[
                  { label: "Urgente", value: "urgent" },
                  { label: "Muy urgente", value: "very_urgent" },
                ]}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            name="observation"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Observación"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
                rows={4}
              />
            )}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col span={24}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Decretar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
