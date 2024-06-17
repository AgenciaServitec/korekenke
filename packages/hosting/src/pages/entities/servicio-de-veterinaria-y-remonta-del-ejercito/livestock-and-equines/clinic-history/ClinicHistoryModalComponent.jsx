import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
  DataEntryModal,
  Form,
  Input,
  notification,
  Row,
  TextArea,
} from "../../../../../components";
import {
  addClinicHistory,
  getClinicHistoryId,
  updateClinicHistory,
} from "../../../../../firebase/collections";

export const ClinicHistoryModalComponent = ({
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  clinicHistoryId,
  currentHistoryClinic,
  livestockAndEquineId,
}) => {
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);

  const isNew = clinicHistoryId === "new";

  const mapForm = (formData) => ({
    id: isNew ? getClinicHistoryId() : currentHistoryClinic.id,
    checkedBy: {
      fullName: "",
      id: "",
      cip: "",
    },
    status: "pending",
    symptomatology: formData.symptomatology,
    diagnosis: formData.diagnosis,
    treatment: formData.treatment,
    observation: formData.observation,
  });

  const saveClinicHistory = async (formData) => {
    try {
      setLoading(true);

      const _clinicHistory = mapForm(formData);

      isNew
        ? await addClinicHistory(
            livestockAndEquineId,
            assignCreateProps(_clinicHistory)
          )
        : await updateClinicHistory(
            livestockAndEquineId,
            _clinicHistory.id,
            assignUpdateProps(_clinicHistory)
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
      loading={loading}
      onSubmit={onSubmit}
    />
  );
};

const ClinicHistoryModal = ({
  currentHistoryClinic,
  isVisibleModal,
  onSetIsVisibleModal,
  onSubmit,
  loading,
  onSetClinicHistoryId,
}) => {
  const schema = yup.object({
    symptomatology: yup.string().required(),
    diagnosis: yup.string().required(),
    treatment: yup.string().required(),
    observation: yup.string().required(),
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
  }, [currentHistoryClinic]);

  const resetForm = () => {
    reset({
      symptomatology: currentHistoryClinic?.symptomatology || null,
      diagnosis: currentHistoryClinic?.diagnosis || null,
      treatment: currentHistoryClinic?.treatment || null,
      observation: currentHistoryClinic?.observation || null,
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
          {/*<Col span={24}>*/}
          {/*  <Controller*/}
          {/*    name="date"*/}
          {/*    control={control}*/}
          {/*    defaultValue=""*/}
          {/*    render={({ field: { onChange, value, name } }) => (*/}
          {/*      <DatePicker*/}
          {/*        label="Fecha"*/}
          {/*        name={name}*/}
          {/*        value={value}*/}
          {/*        onChange={onChange}*/}
          {/*        error={error(name)}*/}
          {/*        required={required(name)}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</Col>*/}
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
        </Row>
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={loading}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </DataEntryModal>
  );
};
