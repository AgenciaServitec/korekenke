import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spinner,
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
  fetchMilitaryRecruitment,
  getMilitaryRecruitmentId,
  militaryRecruitmentRef,
} from "../../../firebase/collections";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiPersonDataByDniGet,
} from "../../../api";
import { capitalize } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { RegisterSuccess } from "./RegisterSuccess";
import { apiUrl } from "../../../firebase";
import { fetchCollectionOnce } from "../../../firebase/utils";
import { EducationLevel } from "../../../data-list";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { RecruitedInformation } from "./RecruitedInformation";

export const MilitaryRecruitmentServiceIntegration = () => {
  const navigate = useNavigate();
  const { militaryServiceRecruitmentId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();
  const {
    getPersonDataByDni,
    getPersonDataByDniLoading,
    getPersonDataByDniResponse,
  } = useApiPersonDataByDniGet();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [recruited, setRecruited] = useState(null);

  const isNew = militaryServiceRecruitmentId === "new";

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const _recruited = isNew
        ? { id: getMilitaryRecruitmentId() }
        : await fetchMilitaryRecruitment(militaryServiceRecruitmentId);

      setRecruited(_recruited);
    })();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!recruited) return <Spinner height="80vh" />;

  const mapForm = (formData, ip) => ({
    ...recruited,
    dni: formData.dni,
    firstName: formData.firstName,
    paternalSurname: formData.paternalSurname,
    maternalSurname: formData.maternalSurname,
    phone: {
      prefix: "+51",
      number: formData.phoneNumber,
    },
    email: formData.email,
    educationLevel: formData.educationLevel,
    location: userLocation,
    ...ip,
  });

  const onSaveMilitaryRecruitmentService = async (formData) => {
    try {
      setLoading(true);
      if (!userLocation) {
        getUserLocation();
      }

      const clientId = await fetch(`${apiUrl}/get-api`);
      const ip = await clientId.json();

      const [userWithDni, userWithEmail, userWithPhoneNumber] =
        await Promise.all([
          userByDni(formData.dni),
          userByEmail(formData.email),
          userByPhoneNumber(formData.phoneNumber),
        ]);

      if (userWithDni || userWithEmail || userWithPhoneNumber) {
        return notification({
          type: "warning",
          title: `El ${
            userWithDni
              ? "dni"
              : userWithEmail
                ? "email"
                : userWithPhoneNumber
                  ? "celular"
                  : ""
          } ya se encuentra registrado.`,
        });
      }

      await addMilitaryRecruitment(assignCreateProps(mapForm(formData, ip)));

      notification({ type: "success" });
      setCurrentStep(1);
    } catch (e) {
      console.log(e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const userByDni = async (dni) => {
    const response = await fetchCollectionOnce(
      militaryRecruitmentRef
        .where("dni", "==", dni)
        .where("isDeleted", "==", false)
        .limit(1),
    );

    return response[0];
  };

  const userByEmail = async (email) => {
    const response = await fetchCollectionOnce(
      militaryRecruitmentRef
        .where("isDeleted", "==", false)
        .where("email", "==", email)
        .limit(1),
    );

    return response[0];
  };

  const userByPhoneNumber = async (phoneNumber) => {
    const response = await fetchCollectionOnce(
      militaryRecruitmentRef
        .where("isDeleted", "==", false)
        .where("phone.number", "==", phoneNumber)
        .limit(1),
    );

    return response[0];
  };

  const stepsItems = [
    {
      title: "Información Personal",
      content: (
        <MilitaryServiceRecruitment
          onSaveMilitaryRecruitmentService={onSaveMilitaryRecruitmentService}
          recruited={recruited}
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
      content: <RegisterSuccess />,
    },
  ];

  return (
    <Container>
      <Row gutter={[16, 16]} justify="center">
        {isNew ? (
          <>
            <Col span={24}>
              <Title level={2} align="center">
                Registro de Reclutamiento Militar
              </Title>
            </Col>
            <Col span={24} md={8}>
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
          </>
        ) : (
          <Col span={24}>
            <RecruitedInformation recruited={recruited} />
          </Col>
        )}
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
  recruited,
}) => {
  const schema = yup.object({
    dni: yup.string().min(8).max(8).required(),
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    phoneNumber: yup.string().min(9).required(),
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
  }, [recruited]);

  const resetForm = () => {
    reset({
      dni: "",
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      phoneNumber: "",
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
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Teléfono"
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
              <Select
                label="Nivel de educación"
                name={name}
                value={value}
                onChange={onChange}
                options={EducationLevel}
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
