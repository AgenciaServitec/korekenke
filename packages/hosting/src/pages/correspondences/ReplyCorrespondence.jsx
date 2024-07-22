import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFormUtils } from "../../hooks";
import * as yup from "yup";
import {
  Button,
  Col,
  Form,
  Modal,
  notification,
  RadioGroup,
  Row,
  TextArea,
  UploadMultiple,
} from "../../components";
import { updateCorrespondence } from "../../firebase/collections";

export const ReplyCorrespondenceModal = ({
  visibleModal,
  onSetVisibleModal,
  correspondence,
}) => {
  const [savingData, setSavingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    message: yup.string().required(),
    documents: yup.mixed(),
    type: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [correspondence?.response]);

  const resetForm = () => {
    reset({
      message: correspondence?.response?.message || "",
      documents: correspondence?.response?.documents || undefined,
      type: correspondence?.response?.type || undefined,
    });
  };

  const onSubmitCorrespondenceReply = async (formData) => {
    try {
      setSavingData(true);

      await updateCorrespondence(correspondence.id, {
        response: { ...formData },
        status: "finalized",
      });

      notification({ type: "success" });
      onSetVisibleModal(false);
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setSavingData(false);
    }
  };

  return (
    <Modal
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Responder solicitud"
      closable
      width="50%"
      centered={false}
      destroyOnClose
    >
      <Form onSubmit={handleSubmit(onSubmitCorrespondenceReply)}>
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
                  rows={5}
                  onChange={onChange}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col sm={24}>
            <Controller
              name="documents"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <UploadMultiple
                  label="Documentos (Pdf)"
                  isImage={false}
                  accept="application/pdf"
                  name={name}
                  value={value}
                  bucket="documents"
                  filePath={`correspondences/${correspondence.id}/responses`}
                  buttonText="Subir archivo"
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  onChange={(file) => onChange(file)}
                  onUploading={setUploadingImage}
                />
              )}
            />
          </Col>
          <Col sm={24}>
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  label="Tipo de respuesta"
                  animation={false}
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  required={required(name)}
                  options={[
                    {
                      label: "Positiva",
                      value: "positive",
                    },
                    {
                      label: "Negativa",
                      value: "negative",
                    },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
        <Row justify="end" gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button
              type="default"
              size="large"
              block
              onClick={() => onSetVisibleModal(false)}
              disabled={savingData || uploadingImage}
            >
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              disabled={uploadingImage}
              loading={savingData}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
