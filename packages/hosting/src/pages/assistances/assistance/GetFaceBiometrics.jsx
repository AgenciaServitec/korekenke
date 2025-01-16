import React, { useEffect, useState } from "react";
import { useWebcam, useFaceDetection } from "../../../hooks";
import styled from "styled-components";
import { useAuthentication } from "../../../providers";
import { notification } from "../../../components";

export const GetFaceBiometrics = ({
  onCloseModal,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const { authUser } = useAuthentication();
  const { videoRef, hasPermission, error: webcamError } = useWebcam();
  const {
    biometricVectors,
    loading,
    error: detectionError,
  } = useFaceDetection(videoRef);
  const [detectionStopped, setDetectionStopped] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

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

  useEffect(() => {
    if (!authUser.biometricVectors) {
      notification({
        type: "warning",
        title: "Registre su rostro en su perfil",
      });
      onCloseModal();
      return;
    }

    if (biometricVectors && biometricVectors.length > 0) {
      const flatBiometricVectors = Array.from(biometricVectors[0]);
      const userVectors = Object.values(authUser.biometricVectors[0]);

      const isSameUser = compareBiometricVectors(
        userVectors,
        flatBiometricVectors,
      );
      if (isSameUser) {
        notification({
          type: "success",
          title: "Autenticación Correcta",
        });
        setIsAuthenticated(true);
      } else {
        notification({
          type: "warning",
          title: "Autenticación Errónea",
        });
        setIsAuthenticated(false);
      }

      setNotificationShown(true);
      setDetectionStopped(true);
      onCloseModal();
    }
  }, [biometricVectors, authUser.biometricVectors]);

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
