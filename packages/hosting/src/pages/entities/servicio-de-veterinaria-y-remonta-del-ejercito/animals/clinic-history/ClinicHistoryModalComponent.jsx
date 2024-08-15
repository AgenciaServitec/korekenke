import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
  ComponentContainer,
  DataEntryModal,
  Form,
  Input,
  notification,
  Row,
  Select,
  TextArea,
  UploadMultiple,
} from "../../../../../components";
import {
  addClinicHistory,
  getClinicHistoryId,
  updateClinicHistory,
} from "../../../../../firebase/collections";
import { v4 as uuidv4 } from "uuid";

export const ClinicHistoryModalComponent = ({
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  clinicHistoryId,
  currentHistoryClinic,
  animalId,
}) => {
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);

  const isNew = clinicHistoryId === "new";
  const _clinicHistoryId = isNew
    ? getClinicHistoryId()
    : currentHistoryClinic?.id;

  const mapForm = (formData) => ({
    id: _clinicHistoryId,
    checkedBy: {
      fullName: "",
      id: "",
      cip: "",
    },
    ...(isNew && { status: "pending" }),
    symptomatology: formData.symptomatology,
    diagnosis: formData.diagnosis,
    treatment: formData.treatment,
    auxiliaryExams: formData.auxiliaryExams,
    observation: formData.observation,
  });

  const saveClinicHistory = async (formData) => {
    try {
      setLoading(true);

      const _clinicHistory = mapForm(formData);

      isNew
        ? await addClinicHistory(animalId, assignCreateProps(_clinicHistory))
        : await updateClinicHistory(
            animalId,
            _clinicHistory.id,
            assignUpdateProps(_clinicHistory),
          );

      onSetIsVisibleModal();
      onSetClinicHistoryId("");
      notification({ type: "success" });
    } catch (e) {
      console.log("Error", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (formData) => saveClinicHistory(formData);

  return (
    <ClinicHistoryModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
      onSetClinicHistoryId={onSetClinicHistoryId}
      currentHistoryClinic={currentHistoryClinic}
      clinicHistoryId={_clinicHistoryId}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
};

const ClinicHistoryModal = ({
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  currentHistoryClinic,
  clinicHistoryId,
  loading,
  onSubmit,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    symptomatology: yup.string().required(),
    diagnosis: yup.string().required(),
    treatment: yup.string().required(),
    observation: yup.string().notRequired(),
    auxiliaryExams: yup.object({
      type: yup.string().notRequired(),
      images: yup.mixed().nullable(),
      documents: yup.mixed().nullable(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [currentHistoryClinic]);

  const resetForm = () => {
    reset({
      symptomatology: currentHistoryClinic?.symptomatology || "",
      diagnosis: currentHistoryClinic?.diagnosis || "",
      treatment: currentHistoryClinic?.treatment || "",
      observation: currentHistoryClinic?.observation || "",
      auxiliaryExams: currentHistoryClinic?.auxiliaryExams
        ? {
            type: currentHistoryClinic.auxiliaryExams?.type || "",
            images: currentHistoryClinic.auxiliaryExams?.images || null,
            documents: currentHistoryClinic.auxiliaryExams?.documents || null,
          }
        : null,
    });
  };

  return (
    <DataEntryModal
      title="Historia Clínica"
      visible={isVisibleModal.historyClinicModal}
      onCancel={() => {
        onSetClinicHistoryId("");
        onSetIsVisibleModal();
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="symptomatology"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Sintomatología"
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
              name="diagnosis"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Diagnóstico"
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
              name="treatment"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Tratamiento"
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
              name="observation"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Observacion"
                  name={name}
                  value={value}
                  rows={5}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <br />
            <ComponentContainer.group label="Exámenes auxiliares">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Controller
                    name="auxiliaryExams.type"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Select
                        label="Tipo"
                        name={name}
                        value={value}
                        options={[
                          {
                            label: "Rayos x",
                            value: "rayos-x",
                          },
                          {
                            label: "Ecografía",
                            value: "ecografia",
                          },
                          {
                            label: "Análisis de heces",
                            value: "analisis-de-heces",
                          },
                          {
                            label: "Análisis de sangre",
                            value: "analisis-de-sangre",
                          },
                          {
                            label: "Pruebas bioquímicas",
                            value: "pruebas-bioquimicas",
                          },
                          {
                            label: "Hemograma completo",
                            value: "hemograma-completo",
                          },
                          {
                            label: "Otros",
                            value: "otros",
                          },
                        ]}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} sm={12}>
                  <Controller
                    name="auxiliaryExams.images"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <UploadMultiple
                        isImage
                        label="Images"
                        accept="image/*"
                        name={name}
                        value={value}
                        withThumbImage={false}
                        buttonText="Subir archivo"
                        bucket="servicioDeVeterinariaYRemontaDelEjercito"
                        fileName={`image-${uuidv4()}`}
                        filePath={`medical-history/${clinicHistoryId}/images`}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
                <Col span={24} sm={12}>
                  <Controller
                    name="auxiliaryExams.documents"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <UploadMultiple
                        label="Documentos"
                        isImage={false}
                        accept="application/*"
                        name={name}
                        value={value}
                        bucket="servicioDeVeterinariaYRemontaDelEjercito"
                        fileName={`document-${uuidv4()}`}
                        filePath={`medical-history/${clinicHistoryId}/documents`}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
              </Row>
            </ComponentContainer.group>
          </Col>
        </Row>
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={loading || uploadingImage}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </DataEntryModal>
  );
};
