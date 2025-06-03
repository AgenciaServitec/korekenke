import React, { useEffect } from "react";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateVisit } from "../../firebase/collections";
import { Button, Form, notification, TextArea } from "../../components";
import { Col, Row } from "antd";

export const VisitedObservation = ({ visit, onCloseModal }) => {
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const schema = yup.object({
    visitedObservation: yup.string().required(),
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
      visitedObservation: visit?.visitedObservation || "",
    });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const onSubmit = async (formData) => {
    const updatedVisit = {
      ...visit,
      visitedObservation: formData.visitedObservation || "",
    };

    try {
      await updateVisit(updatedVisit.id, assignUpdateProps(updatedVisit));
      notification({ type: "success" });
    } catch (error) {
      notification({ type: "error" });
      console.error(error);
    }
    onCloseModal();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            control={control}
            name="visitedObservation"
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Observacion"
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
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" size="large" block htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
