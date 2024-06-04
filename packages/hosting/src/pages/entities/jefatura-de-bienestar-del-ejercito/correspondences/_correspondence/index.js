import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import {
  Acl,
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  TextArea,
  UploadMultiple,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import { firestore } from "../../../../../firebase";
import { useGlobalData } from "../../../../../providers";
import { assign } from "lodash";
import moment from "moment";

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
        dateCorrespondence: moment(formData.dateCorrespondence).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        indicative: formData.indicative,
        issue: formData.issue,
        classification: formData.classification,
        photos: formData.photos,
        documents: formData.documents,
        status: "pending",
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
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    destination: yup.string().required(),
    receivedBy: yup.string().required(),
    class: yup.string().required(),
    indicative: yup.string().required(),
    classification: yup.string().required(),
    issue: yup.string(),
    dateCorrespondence: yup.date().required(),
    photos: yup.mixed().required(),
    documents: yup.mixed(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
      dateCorrespondence: correspondence?.dateCorrespondence
        ? moment(correspondence.dateCorrespondence, "YYYY-MM-DD HH:mm:ss")
        : undefined,
      photos: correspondence?.photos || null,
      documents: correspondence?.documents || null,
    });
  };

  const onSubmitSaveCorrespondence = (formData) =>
    onSaveCorrespondence(formData);

  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="correspondences"
      name="/correspondences"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Correspondencia</Title>
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
                    <TextArea
                      label="Asunto"
                      rows={5}
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
            <Row gutter={[16, 16]}>
              <Col sm={24} md={12}>
                <Controller
                  name="photos"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { onChange, value, name } }) => (
                    <UploadMultiple
                      label="Fotos (523x404)"
                      accept="image/*"
                      bucket="documents"
                      resize="423x304"
                      name={name}
                      value={value}
                      filePath={`correspondences/${correspondence.id}/photos`}
                      isImage={true}
                      buttonText="Subir imagen"
                      error={error(name)}
                      required={required(name)}
                      onChange={(file) => onChange(file)}
                      onUploading={setUploadingImage}
                    />
                  )}
                />
              </Col>
              <Col sm={24} md={12}>
                <Controller
                  name="documents"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { onChange, value, name } }) => (
                    <UploadMultiple
                      isImage={false}
                      label="Documentos"
                      accept="application/pdf"
                      bucket="documents"
                      name={name}
                      value={value}
                      filePath={`correspondences/${correspondence.id}/files`}
                      buttonText="Subir archivo"
                      error={error(name)}
                      required={required(name)}
                      onChange={(file) => onChange(file)}
                      onUploading={setUploadingImage}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row justify="end" gutter={[16, 16]}>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onGoBack()}
                  disabled={savingCorrespondence || uploadingImage}
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
                  disabled={uploadingImage}
                  loading={savingCorrespondence}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
