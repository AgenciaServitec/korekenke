import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import {
  Button,
  Form,
  Input,
  notification,
  DatePicker,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { firestore } from "../../../firebase";
import { useGlobalData } from "../../../providers";
import { assign } from "lodash";

export const CorrespondenceIntegration = () => {
  const navigate = useNavigate();
  const { correspondenceId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const { correspondences } = useGlobalData();

  const [correspondence, setCorrespondence] = useState({});
  const [savingCorrespondence, setSavingCorrespondence] = useState(false);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const correspondence_ =
      correspondenceId === "new"
        ? { id: firestore.collection("correspondences").doc().id }
        : correspondences.find(
            (reception) => reception.id === correspondenceId
          );

    if (!correspondence_) return onGoBack();

    setCorrespondence(correspondence_);
  }, []);

  const onSaveCorrespondence = async (formData) => {
    try {
      setSavingCorrespondence(true);

      await firestore
        .collection("correspondences")
        .doc(correspondence.id)
        .set(
          correspondenceId === "new"
            ? assignCreateProps(mapCorrespondence(correspondence, formData))
            : assignUpdateProps(mapCorrespondence(correspondence, formData)),
          { merge: true }
        );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.log("ErrorSaveReception: ", e);
      notification({ type: "error" });
    } finally {
      setSavingCorrespondence(false);
    }
  };

  const mapCorrespondence = (correspondence, formData) =>
    assign(
      {},
      {
        id: correspondence.id,
        destination: formData.destination,
        receivedBy: formData.receivedBy,
        class: formData.class,
        indicative: formData.indicative,
        classification: formData.classification,
        issue: formData.issue,
        dateCorrespondence: formData.dateCorrespondence,
      }
    );

  return (
    <Correspondence
      correspondence={correspondence}
      onSaveCorrespondence={onSaveCorrespondence}
      onGoBack={onGoBack}
      savingCorrespondence={savingCorrespondence}
    />
  );
};

const Correspondence = ({
  correspondence,
  onSaveCorrespondence,
  savingCorrespondence,
  onGoBack,
}) => {
  const schema = yup.object({
    destination: yup.string().required(),
    photos: yup.mixed().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: false,
    },
  });

  console.log({ errors });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [correspondence]);

  const resetForm = () => {
    reset({
      destination: correspondence?.destination || "",
      receivedBy: correspondence?.receivedBy || "",
      class: correspondence?.class || "",
      indicative: correspondence?.indicative || "",
      classification: correspondence?.classification || "",
      issue: correspondence?.issue || "",
      dateCorrespondence: correspondence?.dateCorrespondence || "",
      photos: correspondence?.photos || [],
    });
  };

  const onSubmitSaveCorrespondence = (formData) =>
    onSaveCorrespondence(formData);

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Correspondencia</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmitSaveCorrespondence)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Controller
                name="destination"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Destinatario"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={12}>
              <Controller
                name="receivedBy"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Recibido Por:"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="class"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Clase"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="dateCorrespondence"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="indicative"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Indicativo"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="classification"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Clasificación"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={{ span: 12, offset: 6 }}>
              <Controller
                name="issue"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Asunto"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          </Row>
          {/* <Row gutter={[16, 16]}>
            <Col span={12}>
              <Controller
                name="photos"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <UploadMultiple
                    label="Fotos documentos (1480x2508)"
                    accept="image/*"
                    bucket="documents"
                    resize="1480x2508"
                    name={name}
                    value={value}
                    filePath={`correspondences/${correspondence.id}`}
                    buttonText="Subir imagen"
                    error={error(name)}
                    required={required(name)}
                    onChange={(file) => onChange(file)}
                    onUploading={setUploadingImage}
                  />
                )}
              />
            </Col>
            <Col span={12}>
              <Controller
                name="photos"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <UploadMultiple
                    label="Fotos documentos (1480x2508)"
                    accept="image/*"
                    bucket="documents"
                    resize="1480x2508"
                    name={name}
                    value={value}
                    filePath={`correspondences/${correspondence.id}`}
                    buttonText="Subir imagen"
                    error={error(name)}
                    required={required(name)}
                    onChange={(file) => onChange(file)}
                    onUploading={setUploadingImage}
                  />
                )}
              />
            </Col>
            </Row> */}
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onGoBack()}
                disabled={savingCorrespondence}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                disabled={savingCorrespondence}
                loading={savingCorrespondence}
              >
                Enviar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
