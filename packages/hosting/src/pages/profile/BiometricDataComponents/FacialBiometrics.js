import React, { useEffect, useState } from "react";
import { useDevice, useFaceDetection, useWebcam } from "../../../hooks";
import {
  Button,
  Card,
  Col,
  notification,
  Paragraph,
  Row,
} from "../../../components";
import { useAuthentication, useModal } from "../../../providers";
import styled from "styled-components";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const FacialBiometrics = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();
  const { onShowModal, onCloseModal } = useModal();
  const { isTablet } = useDevice();
  const [biometricVectors, setBiometricVectors] = useState([]);
  const [isDetected, setIsDetected] = useState(false);

  const showAlert = !authUser?.biometricVectors;

  const updateProfile = async () => {
    try {
      const response = await putUser({
        id: authUser.id,
        phone: authUser.phone,
        email: authUser.email,
        biometricVectors: biometricVectors || [],
      });

      if (!putUserResponse.ok) {
        throw new Error(response);
      }

      setBiometricVectors([]);

      notification({ type: "success" });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
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
    <FacialContainer>
      <Row
        gutter={[16, 16]}
        justify="center"
        align="middle"
        style={{ padding: 16 }}
      >
        <Col span={24} style={{ textAlign: "center" }}>
          <Card
            className={`status-card ${biometricVectors.length ? "detected-biometric" : authUser.biometricVectors ? "registered-biometric" : "unregistered-biometric"}`}
          >
            <div>
              {biometricVectors.length ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#78d225", fontSize: 20 }}
                />
              ) : showAlert ? (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  style={{ color: "red", fontSize: 20 }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "blue", fontSize: 20 }}
                />
              )}
              <Paragraph className="status-paragraph">
                {biometricVectors.length
                  ? "Rostro detectado"
                  : authUser.biometricVectors
                    ? "Rostro registrado"
                    : "Rostro no registrado"}
              </Paragraph>
            </div>
          </Card>
        </Col>
        {biometricVectors.length ? (
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={updateProfile}
              loading={putUserLoading}
              disabled={!isDetected}
            >
              Guardar
            </Button>
          </Col>
        ) : (
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Button type="primary" onClick={onShowWebcam} size="large">
              {authUser.biometricVectors
                ? "Actualizar rostro"
                : "Registrar rostro"}
            </Button>
          </Col>
        )}
      </Row>
    </FacialContainer>
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

const FacialContainer = styled.div`
  .status-card {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #389e0d;
    font-size: 0.9rem;
  }

  .registered-biometric {
    color: blue;
    background-color: #e5e5f8;
    border: 2px solid blue;
  }

  .unregistered-biometric {
    color: #cf1322;
    background-color: #fff1f0;
    border: 2px solid #cf1322;
  }

  .detected-biometric {
    color: #389e0d;
    background-color: #f6ffed;
  }

  .status-paragraph {
    font-weight: 500;
    margin: 0;
    font-size: 14px;
  }
`;
