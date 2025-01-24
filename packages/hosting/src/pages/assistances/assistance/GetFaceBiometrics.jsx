import React, { useEffect } from "react";
import { useFaceDetection, useWebcam } from "../../../hooks";
import styled from "styled-components";
import { isEmpty } from "lodash";
import { notification } from "../../../components";

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

  const calculateEuclideanDistance = (vector1, vector2) => {
    if (vector1.length !== vector2.length) {
      throw new Error("Los vectores deben tener la misma longitud");
    }

    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    return Math.sqrt(sum);
  };

  const compareBiometricVectors = (userVectors, detectedVectors) => {
    const distance = calculateEuclideanDistance(userVectors, detectedVectors);
    const threshold = 0.6;
    return distance < threshold;
  };

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
        await onSaveAssistance(type);
      } else {
        notification({
          type: "error",
          title: "No se pudo registrar de manera exitosa",
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
