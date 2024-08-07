import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "../../../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../../hooks";
import { DasRequestList } from "../../../../../../../../data-list";

export const InstitutionInformationForm = ({
  onPrevStep,
  dasRequest,
  loadingStep3,
  onSaveInstitutionInformationStep3,
}) => {
  const schema = yup.object({
    institution: yup.object({
      id: yup.string().required(),
      specialty: yup.string().required(),
      processType: yup.string().required(),
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

  const _dasRequest = DasRequestList.find(
    (_dasRequest) => _dasRequest.id === dasRequest?.requestType,
  );

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      institution: {
        type: _dasRequest?.institutionId,
        id: dasRequest?.institution?.id || null,
        specialty: dasRequest?.institution?.specialty || "",
        processType: dasRequest?.institution?.processType || "",
      },
    });
  };

  const mapFormData = (formData) => ({
    institution: formData?.institution || null,
  });

  const onSubmit = (formData) =>
    onSaveInstitutionInformationStep3(mapFormData(formData));

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>Datos Institución</span>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={8}>
                  <Controller
                    name="institution.processType"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Select
                        label="Tipo de Proceso"
                        name={name}
                        value={value}
                        options={[
                          {
                            label: "Ingresante",
                            value: "entry",
                          },
                          {
                            label: "Cursando",
                            value: "studying",
                          },
                          {
                            label: "Egresado",
                            value: "graduate",
                          },
                          {
                            label: "Antiguo",
                            value: "ancient",
                          },
                        ]}
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="institution.id"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Nombre de institucion"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="institution.specialty"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Especialidad"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              disabled={loadingStep3}
              onClick={onPrevStep}
            >
              Atras
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              disabled={loadingStep3}
              loading={loadingStep3}
            >
              Siguiente
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
