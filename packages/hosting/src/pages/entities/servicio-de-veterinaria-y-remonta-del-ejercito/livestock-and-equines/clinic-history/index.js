import React, { useState } from "react";
import { Col, Row } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Title,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../hooks";
import * as yup from "yup";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { ClinicHistoryInformation } from "./ClinicHistoryInformation";
import moment from "moment/moment";
import { firestore } from "../../../../../firebase";
import { useNavigate } from "react-router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

export const ClinicHistoryIntegration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [
    livestockAndEquines,
    livestockAndEquinesLoading,
    livestockAndEquinesError,
  ] = useCollectionData(
    firestore
      .collection("livestock-and-equines")
      .doc("3817zSlDzCIFyuI94txS")
      .collection("clinic-history")
  );

  const navigateTo = (liveStockEquinesId) =>
    navigate(`/clinic-history/${liveStockEquinesId}`);

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

      const _clinicHistory = mapForm(formData);

      await firestore
        .collection("livestock-and-equines")
        .doc("3817zSlDzCIFyuI94txS")
        .collection("clinic-history")
        .doc(_clinicHistory.id)
        .set(_clinicHistory);

      notification({ type: "success" });
    } catch (e) {
      console.log("Error", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <ClinicHistoryInformation />
        </Card>
      </Col>
      <Col span={24}>
        <Card
          title={
            <Title level={4} style={{ marginBottom: 0 }}>
              Historia Clínica
            </Title>
          }
          bordered={false}
          type="inner"
        >
          <ClinicHistoryForm
            loading={loading}
            onSaveClinicHistory={saveClinicHistory}
          />
        </Card>
      </Col>
      <Col span={24}>
        <ClinicHistoryTable livestockAndEquines={livestockAndEquines} />
      </Col>
    </Container>
  );
};

const Container = styled(Row)``;

const ClinicHistoryForm = ({ loading, onSaveClinicHistory }) => {
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
    defaultValues: {
      phoneNumber: "",
      cgi: false,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSaveClinicHistory)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={4}>
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
            <Col span={24} md={5}>
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
            <Col span={24} md={5}>
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
            <Col span={24} md={5}>
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
            <Col span={24} md={5}>
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
            <Col xs={24} sm={6} md={4}>
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
      </Col>
    </Row>
  );
};
