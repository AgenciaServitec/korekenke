import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
} from "../../../../../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../hooks";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const ObservationPersonalInformationModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);
  const schema = yup.object({
    observation: yup.object({
      message: yup.string().required(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const mapform = (formData) => ({
    headline: {
      ...dasRequest.headline,
      observation: {
        status: "pending",
        message: formData.observation.message,
      },
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      await updateDasApplication(dasRequest.id, mapform(formData));
      onCloseDasRequestModal();

      notification({
        type: "success",
        message: "Observacion a sido guardada",
      });
    } catch (e) {
      console.error(e);
      notification({ type: "error", message: "Error al guardar observacion" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="observation.message"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Observacion"
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
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            disabled={loading}
            onClick={onCloseDasRequestModal}
          >
            Cancelar
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
