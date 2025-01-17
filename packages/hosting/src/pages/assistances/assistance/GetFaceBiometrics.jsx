import React, { useEffect } from "react";
import { useFaceDetection, useWebcam } from "../../../hooks";
import styled from "styled-components";
import { isEmpty } from "lodash";

export const GetFaceBiometrics = ({
  type,
  onCloseModal,
  user,
  onSaveAssistance,
}) => {
  console.log("type: ", type);

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
    console.log("biometricVectors", biometricVectors);
    if (!isEmpty(biometricVectors)) {
      const flatBiometricVectors = Array.from(biometricVectors[0]);
      const userVectors = Object.values(user.biometricVectors[0]);

      const existsUser = compareBiometricVectors(
        userVectors,
        flatBiometricVectors,
      );

      console.log("existsUser: ", existsUser);

      if (existsUser) {
        await onSaveAssistance(type);
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
