import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
} from "../../../../../components";
import { Col, Row } from "antd";
import { firestore } from "../../../../../firebase";
import moment from "moment";

export const ClinicHistoryModalComponent = ({
  visibleForm,
  onSetVisibleForm,
}) => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);
  const mapForm = (formData) => ({
    id: firestore.collection("livestock-and-equines").doc().id,
    date: moment(formData.date).format("YYYY-MM-DD HH:mm:ss"),
    symptomatology: formData.symptomatology,
    diagnosis: formData.diagnosis,
    treatment: formData.treatment,
    observations: formData.observations,
  });

  const saveClinicHistory = async (formData) => {
    try {
      setLoading(true);

      const _clinicHistory = assignCreateProps(mapForm(formData));

      await firestore
        .collection("livestock-and-equines")
        .doc("3817zSlDzCIFyuI94txS")
        .collection("clinic-history")
        .doc(_clinicHistory.id)
        .set(_clinicHistory);

      onSetVisibleForm(false);

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
      visibleForm={visibleForm}
      onSetVisibleForm={onSetVisibleForm}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};

const ClinicHistoryModal = ({
  historyClinic,
  visibleForm,
  onSetVisibleForm,
  onSubmit,
  loading,
}) => {
  const schema = yup.object({
    date: yup.string().required(),
    symptomatology: yup.string().required(),
    diagnosis: yup.string().required(),
    treatment: yup.string().required(),
    observations: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  return (
    <Modal
      title="Historia Clínica"
      open={visibleForm}
      closable
      onCancel={() => onSetVisibleForm(false)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="date"
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
              name="observations"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Observaciones"
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
    </Modal>
  );
};
