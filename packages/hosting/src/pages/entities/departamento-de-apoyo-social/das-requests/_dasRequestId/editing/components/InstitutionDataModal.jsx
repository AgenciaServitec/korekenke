import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Input,
  modalConfirm,
  notification,
  Row,
  Select,
} from "../../../../../../../components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../hooks";
import { institutions } from "../../../../../../../data-list";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const InstitutionDataModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);

  const mapForm = (formData) => ({
    ...dasRequest,
    institution: {
      ...dasRequest.institution,
      ...(institutions?.[dasRequest?.institution?.type] || []).find(
        (institution) => institution.id === formData.institution.id
      ),
      processType: formData.institution.processType,
      specialty: formData.institution.specialty,
    },
    applicant: {
      documents:
        formData.institution.processType ===
        dasRequest?.institution?.processType
          ? { ...dasRequest?.applicant?.documents }
          : null,
    },
  });

  const updateInstitutionData = async (formData) => {
    try {
      setLoading(true);

      await updateDasApplication(dasRequest.id, mapForm(formData));

      dasRequest.institution.processType === formData.institution.processType &&
        notification({ type: "success" });

      onCloseDasRequestModal();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstitutionData
      dasRequest={dasRequest}
      loading={loading}
      onCloseDasRequestModal={onCloseDasRequestModal}
      onUpdateInstitutionData={updateInstitutionData}
    />
  );
};

const InstitutionData = ({
  dasRequest,
  loading,
  onCloseDasRequestModal,
  onUpdateInstitutionData,
}) => {
  const schema = yup.object({
    institution: yup.object({
      id: yup.string().required(),
      processType: yup.string().required(),
      specialty: yup.string().required(),
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
      institution: {
        id: dasRequest.institution?.id || "",
        processType: dasRequest.institution?.processType || "",
        specialty: dasRequest.institution?.specialty || "",
      },
    });
  };

  const onConfirmEditInstitutionData = (formData) => {
    if (
      dasRequest.institution.processType !== formData.institution.processType
    ) {
      return modalConfirm({
        title:
          "Al cambiar el tipo de proceso tiene que volver a subir sus documentos",
        onOk: () => {
          onUpdateInstitutionData(formData);
          notification({
            type: "warning",
            title: "Datos actualizados correctamente",
            description: "No olvide subir nuevamente sus documentos.",
          });
        },
      });
    }

    onUpdateInstitutionData(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onConfirmEditInstitutionData)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
                ]}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            name="institution.id"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                label="Institución"
                name={name}
                value={value}
                options={(
                  institutions?.[dasRequest?.institution?.type] || []
                ).map((institution) => ({
                  label: institution.name,
                  value: institution.id,
                }))}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
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
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            disabled={loading}
            onClick={onCloseDasRequestModal}
          >
            Cancelar
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Actualizar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
