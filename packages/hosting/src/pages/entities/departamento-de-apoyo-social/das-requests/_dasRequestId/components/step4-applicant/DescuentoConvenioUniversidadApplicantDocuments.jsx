import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Upload,
} from "../../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../hooks";
import { v4 as uuidv4 } from "uuid";

export const DescuentoConvenioUniversidadApplicantDocuments = ({
  onPrevStep,
  dasRequest,
  loadingStep4,
  onSaveApplicantDocumentsStep4,
}) => {
  const schema = yup.object({
    applicant: yup.object({
      documents: yup.object({
        copyConstanciaIngresoUniv:
          dasRequest.institution.processType === "entry"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
        copyConsolidadoNotasUniv:
          dasRequest.institution.processType === "graduate"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
        copyBoletaPagoMatriculaUniv: yup.mixed().required(),
      }),
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
  }, []);

  const resetForm = () => {
    reset({
      applicant: {
        documents: {
          copyConstanciaIngresoUniv:
            dasRequest?.institution?.processType === "entry"
              ? dasRequest?.applicant?.documents?.copyConstanciaIngresoUniv ||
                null
              : null,
          copyConsolidadoNotasUniv:
            dasRequest?.institution?.processType === "graduate"
              ? dasRequest?.applicant?.documents?.copyConsolidadoNotasUniv ||
                null
              : null,
          copyBoletaPagoMatriculaUniv:
            dasRequest?.applicant?.documents?.copyBoletaPagoMatriculaUniv ||
            null,
        },
      },
    });
  };

  const mapFormData = (formData) => ({
    applicant: formData?.applicant || null,
  });

  const onSubmit = (formData) =>
    onSaveApplicantDocumentsStep4(mapFormData(formData));

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row justify="end" gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>
                  Documentos del Aplicante
                </span>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <>
                  {dasRequest.institution.processType === "graduate" && (
                    <Col sm={24} md={12}>
                      <Controller
                        name="applicant.documents.copyConsolidadoNotasUniv"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Upload
                            label="Copia de Consolidado de notas (último ciclo)"
                            accept="image/*"
                            name={name}
                            value={value}
                            withThumbImage={false}
                            bucket="departamentoDeApoyoSocial"
                            fileName={`copyConsolidadoNotasUniv-photo-${uuidv4()}`}
                            filePath={`das-applicants/${dasRequest.id}/files`}
                            buttonText="Subir archivo"
                            error={error(name)}
                            helperText={errorMessage(name)}
                            required={required(name)}
                            onChange={(file) => onChange(file)}
                          />
                        )}
                      />
                    </Col>
                  )}
                  {dasRequest.institution.processType === "entry" && (
                    <Col sm={24} md={12}>
                      <Controller
                        name="applicant.documents.copyConstanciaIngresoUniv"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Upload
                            label="Copia de Constancia de Ingreso de la Universidad"
                            accept="image/*"
                            name={name}
                            value={value}
                            withThumbImage={false}
                            bucket="departamentoDeApoyoSocial"
                            fileName={`copyConstanciaIngresoUniv-photo-${uuidv4()}`}
                            filePath={`das-applicants/${dasRequest.id}/files`}
                            buttonText="Subir archivo"
                            error={error(name)}
                            helperText={errorMessage(name)}
                            required={required(name)}
                            onChange={(file) => onChange(file)}
                          />
                        )}
                      />
                    </Col>
                  )}
                  <Col sm={24} md={12}>
                    <Controller
                      name="applicant.documents.copyBoletaPagoMatriculaUniv"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Upload
                          label="Copia de boleta pago matricula de la Universidad"
                          accept="image/*"
                          name={name}
                          value={value}
                          withThumbImage={false}
                          bucket="departamentoDeApoyoSocial"
                          fileName={`copyBoletaPagoMatriculaUniv-photo-${uuidv4()}`}
                          filePath={`das-applicants/${dasRequest.id}/files`}
                          buttonText="Subir archivo"
                          error={error(name)}
                          helperText={errorMessage(name)}
                          required={required(name)}
                          onChange={(file) => onChange(file)}
                        />
                      )}
                    />
                  </Col>
                </>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              disabled={loadingStep4}
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
              disabled={loadingStep4}
              loading={loadingStep4}
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
