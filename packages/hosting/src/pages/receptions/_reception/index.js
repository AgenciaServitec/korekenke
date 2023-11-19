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

export const ReceptionIntegration = () => {
  const navigate = useNavigate();
  const { receptionId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const { receptions } = useGlobalData();

  const [reception, setReception] = useState({});
  const [savingReception, setSavingReception] = useState(false);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const reception_ =
      receptionId === "new"
        ? { id: firestore.collection("receptions").doc().id }
        : receptions.find((reception) => reception.id === receptionId);

    if (!reception_) return onGoBack();

    setReception(reception_);
  }, []);

  const onSaveReception = async (formData) => {
    try {
      setSavingReception(true);

      await firestore
        .collection("receptions")
        .doc(reception.id)
        .set(
          receptionId === "new"
            ? assignCreateProps(mapReception(reception, formData))
            : assignUpdateProps(mapReception(reception, formData)),
          { merge: true }
        );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.log("ErrorSaveReception: ", e);
      notification({ type: "error" });
    } finally {
      setSavingReception(false);
    }
  };

  const mapReception = (reception, formData) =>
    assign(
      {},
      {
        id: reception.id,
        nameId: getNameId(formData.name),
        name: formData.name,
        documento1Photo: formData.documento1Photo,
        active: !!formData?.active,
      }
    );

  return (
    <Reception
      reception={reception}
      onSaveReception={onSaveReception}
      onGoBack={onGoBack}
      savingReception={savingReception}
    />
  );
};

const Reception = ({
  reception,
  onSaveReception,
  savingReception,
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
      active: false,
    },
  });

  console.log({ errors });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [reception]);

  const resetForm = () => {
    reset({
      name: reception?.name || "",
      documento1Photo: reception?.documento1Photo || null,
      active: reception?.active || false,
    });
  };

  const onSubmitSaveReception = (formData) => onSaveReception(formData);

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Recepción</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmitSaveReception)}>
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
                    filePath={`receptions/${reception.id}`}
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
                disabled={uploadingImage | savingReception}
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
                disabled={uploadingImage | savingReception}
                loading={savingReception}
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
