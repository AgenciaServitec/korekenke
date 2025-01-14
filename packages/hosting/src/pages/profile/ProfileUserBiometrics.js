import React, { useEffect, useState } from "react";
import {
  useWebcam,
  useFaceDetection,
  useDevice,
  useFormUtils,
} from "../../hooks";
import {
  Button,
  Form,
  notification,
  Col,
  Row,
  TextArea,
  Tag,
} from "../../components";
import { useAuthentication, useModal } from "../../providers";
import * as yup from "yup";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { assign } from "lodash";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../api";

export const ProfileUserBiometrics = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();
  const { onShowModal, onCloseModal } = useModal();
  const { isTablet } = useDevice();
  const [biometricVectors, setBiometricVectors] = useState([]);
  const [isDetected, setIsDetected] = useState(false);

  const showAlert = !authUser?.biometricVectors;

  const schema = yup.object({
    biometricVectors: yup.array().default([]),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, required } = useFormUtils({ errors, schema });

  const updateProfile = async (formData) => {
    try {
      const response = await putUser(
        assign({}, formData, {
          id: authUser.id,
          phone: authUser.phone,
          email: authUser.email,
          biometricVectors: biometricVectors || [],
        }),
      );

      if (!putUserResponse.ok) {
        throw new Error(response);
      }

      notification({ type: "success" });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const resetForm = () => {
    reset({
      biometricVectors: authUser?.biometricVectors || [],
    });
  };

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  const onShowWebcam = () => {
    onShowModal({
      title: "Registro de Biométricos Faciales",
      width: `${isTablet ? "60%" : "30%"}`,
      onRenderBody: () => (
        <UserBiometrics onVectorsDetected={onVectorsDetected} />
      ),
    });
  };

  const onVectorsDetected = (vectors) => {
    setBiometricVectors(vectors);
    setIsDetected(true);
    onCloseModal();
  };

  return (
    <div>
      {showAlert && <Tag color="red">Registra tus biometricos faciales</Tag>}
      <Tag color="green">Biometricos faciales registrados</Tag>

      <Button onClick={onShowWebcam}>
        {authUser.biometricVectors ? "Cambiar Biometricos" : "Registrar Rostro"}
      </Button>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col>
            <Controller
              control={control}
              name="biometricVectors"
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Vectores Biométricos"
                  value={biometricVectors.length ? "Vectores detectados" : ""}
                  onChange={(e) => onChange(e.target.value)}
                  name={name}
                  disabled
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={putUserLoading}
              disabled={!isDetected}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const UserBiometrics = ({ onVectorsDetected }) => {
  const { videoRef, hasPermission, error: webcamError } = useWebcam();
  const {
    biometricVectors,
    loading,
    error: detectionError,
  } = useFaceDetection(videoRef);

  useEffect(() => {
    if (biometricVectors.length > 0) {
      onVectorsDetected(biometricVectors);
    }
  }, [biometricVectors, onVectorsDetected]);

  if (webcamError || detectionError) {
    const errorMessage = webcamError?.message || detectionError?.message;
    return <div>Error: {errorMessage}</div>;
  }

  if (hasPermission === false) {
    return <div>No se concedió el permiso para acceder a la cámara.</div>;
  }

  if (loading) {
    return <div>Cargando modelos de detección facial...</div>;
  }

  return (
    <Container>
      <div className="face-biometrics-container">
        <video ref={videoRef} autoPlay muted width="100%" height="auto" />
        <canvas id="overlay" className="overlay-canvas" />
      </div>
    </Container>
  );
};

const Container = styled.div`
  .face-biometrics-container {
    position: relative;
    width: 100%;
  }

  .overlay-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
