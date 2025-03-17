import React, { useEffect } from "react";
import { useFaceDetection, useWebcam } from "../../../hooks";
import styled from "styled-components";
import { isEmpty } from "lodash";
import { notification } from "../../../components";
import { compareBiometricVectors } from "../_utils";

export const GetFaceBiometrics = ({
  type,
  onCloseModal,
  onSaveAssistance,
  userBiometrics,
}) => {
  const { videoRef, hasPermission, error: webcamError } = useWebcam();
  const {
    biometricVectors,
    loading,
    error: detectionError,
  } = useFaceDetection(videoRef);

  const onBiometricValidated = async () => {
    if (!userBiometrics) {
      notification({
        type: "warning",
        description: "registre su rostro en perfil",
      });
      onCloseModal();
      return;
    }

    if (!isEmpty(biometricVectors)) {
      const flatBiometricVectors = Array.from(biometricVectors[0]);
      const userBiometricVectors = Object.values(userBiometrics);

      const existsUser = compareBiometricVectors(
        userBiometricVectors,
        flatBiometricVectors,
      );

      if (existsUser) {
        await onCloseModal();
        onSaveAssistance(type);
        return;
      } else {
        notification({
          type: "error",
          title: "No se pudo reconocer",
          description: "Vuelve a intentarlo",
        });
      }

      onCloseModal();
    }
  };

  useEffect(() => {
    (async () => await onBiometricValidated())();
  }, [biometricVectors]);

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
        <video ref={videoRef} autoPlay muted width="100%" height="100%" />
        <canvas id="overlay" className="overlay-canvas" />
      </div>
    </Container>
  );
};

const Container = styled.div`
  .face-biometrics-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .overlay-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;
