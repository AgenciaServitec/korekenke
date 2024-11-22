import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  RadioGroup,
  Row,
  TextArea,
  UploadMultiple,
} from "../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { updateHoliday } from "../../firebase/collections/holidays";

export const HolidayRequestReply = ({ holidayRequest, onCloseModal }) => {
  const [savingData, setSavingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const schema = yup.object({
    message: yup.string().required(),
    documents: yup.mixed(),
    images: yup.mixed(),
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
  }, [holidayRequest?.response]);

  const resetForm = () => {
    reset({
      message: holidayRequest?.response?.message || "",
      documents: holidayRequest?.response?.documents || undefined,
      images: holidayRequest?.response?.images || undefined,
      type: holidayRequest?.response?.type || undefined,
    });
  };

  const onSubmitDasRequestReply = async (formData) => {
    try {
      setSavingData(true);

      await updateHoliday(
        holidayRequest.id,
        assignUpdateProps({
          response: { ...formData },
          status: "finalized",
        }),
      );
      notification({ type: "success" });
      onCloseModal();
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setSavingData(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitDasRequestReply)}>
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
        <Col span={12}>
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <UploadMultiple
                label="Imagenes (Jpg)"
                withThumbImage={false}
                isImage={true}
                accept="image/*"
                name={name}
                value={value}
                bucket="FALTA_BUCKET"
                filePath={`holidays-request/${holidayRequest.id}/images`}
                buttonText="Subir imagen"
                error={error(name)}
                required={required(name)}
                onChange={(file) => onChange(file)}
                onUploading={setUploadingImage}
              />
            )}
          />
        </Col>
        <Col sm={12}>
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
                bucket="FALTA_BUCKET"
                filePath={`holidays-request/${holidayRequest.id}/files`}
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
  );
};
