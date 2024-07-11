import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Form,
  Row,
  Upload,
} from "../../../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../../hooks";
import { v4 as uuidv4 } from "uuid";

export const DescuentoConvenioInstitutoApplicantDocuments = ({
  onPrevStep,
  dasRequest,
  loadingStep4,
  onSaveApplicantDocumentsStep4,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    applicant: yup.object({
      documents: yup.object({
        copyCipHeadline: dasRequest?.isHeadline
          ? yup.mixed().required()
          : yup.mixed().notRequired().nullable(),
        copyDniHeadline: dasRequest?.isHeadline
          ? yup.mixed().required()
          : yup.mixed().notRequired().nullable(),
        copyCifFamiliar: dasRequest?.isHeadline
          ? yup.mixed().notRequired().nullable()
          : yup.mixed().required(),
        copyDniFamiliar: dasRequest?.isHeadline
          ? yup.mixed().notRequired().nullable()
          : yup.mixed().required(),
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
          copyCipHeadline:
            dasRequest?.applicant?.documents?.copyCipHeadline || null,
          copyDniHeadline:
            dasRequest?.applicant?.documents?.copyDniHeadline || null,
          copyCifFamiliar:
            dasRequest?.applicant?.documents?.copyCifFamiliar || null,
          copyDniFamiliar:
            dasRequest?.applicant?.documents?.copyDniFamiliar || null,
        },
      },
    });
  };

  const mapFormData = (formData) => ({
    applicant: formData?.applicant || null,
  });

  const isHeadline = dasRequest?.isHeadline;

  const onSubmit = (formData) =>
    onSaveApplicantDocumentsStep4(mapFormData(formData));

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row justify="end" gutter={[16, 16]}>
          <>
            {isHeadline && (
              <>
                <Col sm={24} md={12}>
                  <Controller
                    name="applicant.documents.copyCipHeadline"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de CIP del Titular"
                        accept="image/*"
                        name={name}
                        value={value}
                        withThumbImage={false}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`copyCipHeadline-photo-${uuidv4()}`}
                        filePath={`das-applicants/${dasRequest.id}/files`}
                        additionalFields={{
                          numberCopies: 2,
                          label: "Copia de CIP del Titular",
                        }}
                        buttonText="Subir archivo"
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
                <Col sm={24} md={12}>
                  <Controller
                    name="applicant.documents.copyDniHeadline"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de DNI del Titular"
                        accept="image/*"
                        name={name}
                        value={value}
                        withThumbImage={false}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`copyDniHeadline-photo-${uuidv4()}`}
                        filePath={`das-applicants/${dasRequest.id}/files`}
                        additionalFields={{
                          numberCopies: 2,
                          label: "Copia de DNI del Titular",
                        }}
                        buttonText="Subir archivo"
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
              </>
            )}
            {!isHeadline && (
              <>
                <Col sm={24} md={12}>
                  <Controller
                    name="applicant.documents.copyCifFamiliar"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de CIF del Familiar"
                        accept="image/*"
                        name={name}
                        value={value}
                        withThumbImage={false}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`copyCifFamiliar-photo-${uuidv4()}`}
                        filePath={`das-applicants/${dasRequest.id}/files`}
                        additionalFields={{
                          numberCopies: 2,
                          label: "Copia de CIF del Familiar",
                        }}
                        buttonText="Subir archivo"
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
                <Col sm={24} md={12}>
                  <Controller
                    name="applicant.documents.copyDniFamiliar"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de DNI del Familiar"
                        accept="image/*"
                        name={name}
                        value={value}
                        withThumbImage={false}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`copyDniFamiliar-photo-${uuidv4()}`}
                        filePath={`das-applicants/${dasRequest.id}/files`}
                        additionalFields={{
                          numberCopies: 2,
                          label: "Copia de DNI del Familiar",
                        }}
                        buttonText="Subir archivo"
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                        onUploading={setUploadingImage}
                      />
                    )}
                  />
                </Col>
              </>
            )}
          </>
        </Row>
        <Row gutter={[16, 16]} align="end">
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              disabled={loadingStep4 || uploadingImage}
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
              disabled={loadingStep4 || uploadingImage}
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
