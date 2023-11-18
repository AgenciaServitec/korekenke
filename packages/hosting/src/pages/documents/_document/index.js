import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import { Button, Form, Input, notification, Upload } from "../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { firestore } from "../../../firebase";
import { useGlobalData } from "../../../providers";
import { assign } from "lodash";
import { Switch } from "antd";
import { getNameId } from "../../../utils";

export const DocumentIntegration = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const { documents } = useGlobalData();

  const [document, setDocument] = useState({});
  const [savingDocument, setSavingDocument] = useState(false);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const document_ =
      documentId === "new"
        ? { id: firestore.collection("documents").doc().id }
        : documents.find((document) => document.id === documentId);

    if (!document_) return onGoBack();

    setDocument(document_);
  }, []);

  const onSubmitSaveDocument = async (formData) => {
    try {
      setSavingDocument(true);

      await firestore
        .collection("documents")
        .doc(document.id)
        .set(
          documentId === "new"
            ? assignCreateProps(mapDocument(document, formData))
            : assignUpdateProps(mapDocument(document, formData)),
          { merge: true }
        );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.log("ErrorSaveDocument: ", e);
      notification({ type: "error" });
    } finally {
      setSavingDocument(false);
    }
  };

  const mapDocument = (document, formData) =>
    assign(
      {},
      {
        id: document.id,
        nameId: getNameId(formData.name),
        name: formData.name,
        documento1Photo: formData.documento1Photo,
        active: !!formData?.active,
      }
    );

  return (
    <Document
      document={document}
      onSubmitSaveDocument={onSubmitSaveDocument}
      onGoBack={onGoBack}
      savingDocument={savingDocument}
    />
  );
};

const Document = ({
  document,
  onSubmitSaveDocument,
  savingDocument,
  onGoBack,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    name: yup.string().required(),
    documento1Photo: yup.mixed().notRequired(),
    active: yup.boolean().notRequired(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: false
    }
  });

  console.log({errors})

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [document]);

  const resetForm = () => {
    reset({
      name: document?.name || "",
      documento1Photo: document?.documento1Photo || null,
      active: document?.active || false,
    });
  };

  const submitSaveDocument = (formData) => onSubmitSaveDocument(formData);

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Documento</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(submitSaveDocument)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombre"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="documento1Photo"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <Upload
                    label="Foto documento 1 (300x800)"
                    accept="image/*"
                    name={name}
                    value={value}
                    filePath={`documents/${document.id}`}
                    buttonText="Subir imagen"
                    error={error(name)}
                    required={required(name)}
                    onChange={(file) => onChange(file)}
                    onUploading={setUploadingImage}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="active"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    checked={value}
                    onChange={(checked) => onChange(checked)}
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
                disabled={uploadingImage | savingDocument}
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
                disabled={uploadingImage | savingDocument}
                loading={savingDocument}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
