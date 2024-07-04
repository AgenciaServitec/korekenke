import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Upload,
  Alert,
} from "../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../hooks";
import { v4 as uuidv4 } from "uuid";

export const InstituteApplicantDocuments = ({
  onPrevStep,
  dasRequest,
  loadingStep4,
  onSaveApplicantDocumentsStep4,
}) => {
  const schema = yup.object({
    applicant: yup.object({
      documents: yup.object({
        copyLiquidacionHaberesHeadline:
          dasRequest.institution.id === "britanico"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
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
          copyLiquidacionHaberesHeadline:
            dasRequest?.applicant?.documents?.copyLiquidacionHaberesHeadline ||
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
                  {dasRequest.institution.id === "britanico" ? (
                    <Col sm={24} md={12}>
                      <Controller
                        name="applicant.documents.copyLiquidacionHaberesHeadline"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Upload
                            label="Copia de Liquidación de Haberes del Titular"
                            accept="image/*"
                            name={name}
                            value={value}
                            withThumbImage={false}
                            bucket="departamentoDeApoyoSocial"
                            fileName={`copyLiquidacionHaberesHeadline-photo-${uuidv4()}`}
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
                  ) : (
                    <Alert
                      message="Los documentos no son necesarios para este instituto,
                      puedes continuar de manera normal"
                      type="info"
                      showIcon
                      style={{ margin: "auto" }}
                    />
                  )}
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
