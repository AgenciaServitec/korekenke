import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Steps,
  Title,
} from "../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import styled from "styled-components";
import {
  addMilitaryRecruitment,
  getMilitaryRecruitmentId,
} from "../../../firebase/collections";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiPersonDataByDniGet,
} from "../../../api";
import { capitalize } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const MilitaryRecruitmentServiceIntegration = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    getPersonDataByDni,
    getPersonDataByDniLoading,
    getPersonDataByDniResponse,
  } = useApiPersonDataByDniGet();

  const mapForm = (formData) => ({
    id: getMilitaryRecruitmentId(),
    dni: formData.dni,
    firstName: formData.firstName,
    paternalSurname: formData.paternalSurname,
    maternalSurname: formData.maternalSurname,
    phone: formData.phone,
    email: formData.email,
    educationLevel: formData.educationLevel,
  });

  const onSaveMilitaryRecruitmentService = async (formData) => {
    try {
      setLoading(true);
      await addMilitaryRecruitment(assignCreateProps(mapForm(formData)));
      setCurrentStep(1);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const stepsItems = [
    {
      title: "Información Personal",
      content: (
        <MilitaryServiceRecruitment
          onSaveMilitaryRecruitmentService={onSaveMilitaryRecruitmentService}
          currentStep={currentStep}
          loading={loading}
          getPersonDataByDni={getPersonDataByDni}
          getPersonDataByDniLoading={getPersonDataByDniLoading}
          getPersonDataByDniResponse={getPersonDataByDniResponse}
        />
      ),
    },
    {
      title: "Completado",
      content: <div>Completado</div>,
    },
  ];

  return (
    <Container>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Title level={2} align="center">
            Registro de Reclutamiento Militar
          </Title>
        </Col>
        <Col span={8}>
          <Steps
            labelPlacement="vertical"
            current={currentStep}
            items={stepsItems}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="center">
            <Col span={24} md={10}>
              {stepsItems[currentStep].content}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const MilitaryServiceRecruitment = ({
  onSaveMilitaryRecruitmentService,
  loading,
  getPersonDataByDni,
  getPersonDataByDniLoading,
  getPersonDataByDniResponse,
}) => {
  const schema = yup.object({
    dni: yup.string().min(8).max(8).required(),
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    phone: yup.number().required(),
    email: yup.string().email().required(),
    educationLevel: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      dni: "",
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      phone: "",
      email: "",
      educationLevel: "",
    });
  };

  const userResetFields = (user) => {
    setValue("firstName", capitalize(user?.firstName || ""));
    setValue("paternalSurname", capitalize(user?.paternalSurname || ""));
    setValue("maternalSurname", capitalize(user?.maternalSurname || ""));
  };

  useEffect(() => {
    const existsDni = (watch("dni") || "").length === 8;

    if (existsDni) {
      (async () => {
        try {
          const response = await getPersonDataByDni(watch("dni"));

          if (!getPersonDataByDniResponse.ok) {
            throw new Error(response);
          }

          userResetFields(response);
        } catch (e) {
          const errorResponse = getApiErrorResponse(e);
          apiErrorNotification(errorResponse);
          userResetFields(null);
        }
      })();
    }
  }, [watch("dni")]);

  return (
    <Form onSubmit={handleSubmit(onSaveMilitaryRecruitmentService)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="dni"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="DNI"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
                suffix={
                  getPersonDataByDniLoading && (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  )
                }
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Nombres"
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
        <Col span={24}>
          <Controller
            name="paternalSurname"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Apellido Paterno"
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
        <Col span={24}>
          <Controller
            name="maternalSurname"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Apellido Materno"
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
        <Col span={24}>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Celular"
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
        <Col span={24}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Correo Electrónico"
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
        <Col span={24}>
          <Controller
            name="educationLevel"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Nivel de educación"
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
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button
            type="primary"
            size="large"
            block
            disabled={loading}
            loading={loading}
            htmlType="submit"
          >
            Enviar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 70vh;

  .ant-steps-item-title {
    line-height: 1.3;
    font-size: 13px;
  }
  .ant-steps-item-description {
    font-size: 12px;
  }
`;
