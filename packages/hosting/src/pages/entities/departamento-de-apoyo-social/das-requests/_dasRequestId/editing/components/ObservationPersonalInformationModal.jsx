import React, { useEffect, useState } from "react";
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
import { updateDasRequest } from "../../../../../../../firebase/collections";
import { orderBy } from "lodash";

export const ObservationPersonalInformationModal = ({
  dasRequest,
  observation = "new",
  onCloseDasRequestModal,
  onAddOrEditObservation,
}) => {
  const [loading, setLoading] = useState(false);
  const schema = yup.object({
    message: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    reset({
      message: observation?.message,
    });
  };

  useEffect(() => {
    resetForm();
  }, [observation]);

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const isNew = observation === "new";

  const observationsMap = (formData) => {
    return {
      headline: {
        ...dasRequest.headline,
        observations: orderBy(
          onAddOrEditObservation(
            observation,
            dasRequest?.headline?.observations || [],
            formData,
            isNew,
          ),
          ["createAt"],
          "desc",
        ),
      },
    };
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      await updateDasRequest(dasRequest.id, observationsMap(formData));
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
            name="message"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <TextArea
                label="Mensaje"
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
            Agregar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
