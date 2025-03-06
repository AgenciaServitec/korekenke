import React, { useEffect, useState } from "react";
import {
  useWebcam,
  useFaceDetection,
  useDevice,
  useFormUtils,
} from "../../../hooks";
import {
  Button,
  Form,
  notification,
  Col,
  Row,
  Card,
  Tag,
  Paragraph,
} from "../../../components";
import { useAuthentication, useModal } from "../../../providers";
import * as yup from "yup";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { assign } from "lodash";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../../api";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export const FacialBiometrics = () => {
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
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      style={{ padding: 16 }}
    >
      <Col span={24} style={{ textAlign: "center" }}>
        {showAlert ? (
          <Tag
            icon={<ExclamationCircleOutlined />}
            color="#fff1f0"
            style={{
              color: "#cf1322",
              border: "1px solid #ffccc7",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Registre su Rostro
          </Tag>
        ) : (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#f6ffed"
            style={{
              color: "#389e0d",
              border: "1px solid #b7eb8f",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Rostro Registrado
          </Tag>
        )}
      </Col>
      <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
        <Button type="primary" onClick={onShowWebcam} size="large">
          {authUser.biometricVectors
            ? "Cambiar Biométricos"
            : "Registrar Rostro"}
        </Button>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                control={control}
                name="biometricVectors"
                render={() => (
                  <Card
                    style={{
                      textAlign: "center",
                      backgroundColor: biometricVectors.length
                        ? "rgba(120, 210, 37, 0.1)"
                        : "rgb(200,211,47,0.1)",
                      border: `2px solid ${biometricVectors.length ? "#78d225" : "#c8d32f"}`,
                      maxWidth: 400,
                      margin: "0 auto",
                      padding: 16,
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      {biometricVectors.length ? (
                        <CheckCircleFilled
                          style={{ color: "#78d225", fontSize: 20 }}
                        />
                      ) : (
                        <ExclamationCircleFilled
                          style={{ color: "#c8d32f", fontSize: 20 }}
                        />
                      )}
                      <Paragraph
                        style={{
                          color: biometricVectors.length
                            ? "#78d225"
                            : "#c8d32f",
                          fontWeight: 500,
                          margin: 0,
                          fontSize: 14,
                        }}
                      >
                        {biometricVectors.length
                          ? "Biométricos listos para guardar"
                          : "Se habilitará el botón al detectar su rostro"}
                      </Paragraph>
                    </div>
                  </Card>
                )}
              />
            </Col>
            <Col xs={24} sm={12} md={8} style={{ margin: "0 auto" }}>
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
      </Col>
    </Row>
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
