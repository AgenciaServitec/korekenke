import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../../../hooks";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
} from "../../../../../../../components";
import { updateDasRequest } from "../../../../../../../firebase/collections";
import { orderBy } from "lodash";

export const ObservationForInstitucionalDataModal = ({
  dasRequest,
  observation = "new",
  onCloseDasRequestModal,
  onAddOrEditObservation,
}) => {
  const [loading, setLoading] = useState(false);

  const isNew = observation === "new";

  const observationsMap = (formData) => ({
    institution: {
      ...dasRequest.institution,
      observations: orderBy(
        onAddOrEditObservation(
          observation,
          dasRequest?.applicant?.observations || [],
          formData,
          isNew,
        ),
        ["createAt"],
        "desc",
      ),
    },
  });

  const addObservationForInstitucionalData = async (formData) => {
    try {
      setLoading(true);

      await updateDasRequest(dasRequest.id, observationsMap(formData));

      onCloseDasRequestModal();

      notification({ type: "success", message: "Observacion a sido guardada" });
    } catch (e) {
      console.error(e);
      notification({ type: "error", message: "Error al guardar observacion" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ObservationForInstitucionalData
      onAddObservationForInstitucionalData={addObservationForInstitucionalData}
      loading={loading}
    />
  );
};

const ObservationForInstitucionalData = ({
  onAddObservationForInstitucionalData,
  loading,
}) => {
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

  const onSubmit = (formData) => {
    onAddObservationForInstitucionalData(formData);
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
                label="Mensaje"
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
            Agregar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
