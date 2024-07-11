import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../../../hooks";
import {
  Alert,
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
} from "../../../../../../../components";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const ObservationForInformationInstitutionModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);
  console.log("Das Request: ", { dasRequest });

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
    defaultValues: {
      isHeadline: true,
    },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const mapForm = (formData) => ({
    institution: {
      ...dasRequest.institution,
      observation: {
        message: formData.observation.message,
        status: "pending",
      },
    },
  });

  console.log("Observación: ", dasRequest?.institution?.observation);

  const onAddObservation = async (formData) => {
    try {
      setLoading(true);

      await updateDasApplication(dasRequest.id, mapForm(formData));

      onCloseDasRequestModal();

      notification({ type: "success" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (formData) => {
    onAddObservation(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="observation.message"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Observación"
                name={name}
                value={value}
                rows={5}
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
        <Col span={24}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Enviar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
