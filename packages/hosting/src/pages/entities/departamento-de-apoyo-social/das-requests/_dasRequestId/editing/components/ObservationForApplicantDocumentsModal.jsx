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
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";
import { orderBy } from "lodash";
import { firestoreTimestamp } from "../../../../../../../firebase/firestore";
import { v1 as uuidv1 } from "uuid";

export const ObservationForApplicantDocumentsModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);

  const observationsMap = (formData) => ({
    applicant: {
      ...dasRequest.applicant,
      observations: orderBy(
        [
          ...(dasRequest?.applicant?.observations || []),
          {
            id: uuidv1(),
            message: formData.message,
            status: "pending",
            isDeleted: false,
            createAt: firestoreTimestamp.now(),
          },
        ],
        ["createAt"],
        "desc"
      ),
    },
  });

  const addObservationForApplicantDocuments = async (formData) => {
    try {
      setLoading(true);

      await updateDasApplication(dasRequest.id, observationsMap(formData));

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
    <ObservationForApplicantDocuments
      onAddObservationForApplicantDocuments={
        addObservationForApplicantDocuments
      }
      loading={loading}
    />
  );
};

const ObservationForApplicantDocuments = ({
  onAddObservationForApplicantDocuments,
  loading,
}) => {
  const schema = yup.object({
    message: yup.string().required(),
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
    onAddObservationForApplicantDocuments(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="message"
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
