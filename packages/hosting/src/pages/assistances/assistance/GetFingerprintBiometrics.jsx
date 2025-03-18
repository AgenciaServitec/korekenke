import React, { useState } from "react";
import styled from "styled-components";
import { Button, notification } from "../../../components";
import { useFingerprint } from "../../../hooks";
import { isEmpty } from "lodash";

export const GetFingerprintBiometrics = ({
  type,
  onCloseModal,
  onSaveAssistance,
  userFingerprint,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const onDetectFingerprint = async (template) => {
    if (!template || template.length < 10) {
      notification({ type: "error", description: "Error al capturar huella" });
      return;
    }
    if (!isEmpty(template)) {
      setIsCapturing(false);
      await onCloseModal();
      onSaveAssistance(type);
    } else {
      notification({
        type: "error",
        title: "No se pudo reconocer",
        description: "Vuelve a intentarlo",
      });
    }
  };

  const { isReady, startCapture, device } = useFingerprint(onDetectFingerprint);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await startCapture();
    } catch (error) {
      notification({ type: "error" });
    }
  };

  return (
    <Container>
      <Button onClick={handleCapture} disabled={!isReady || isCapturing}>
        {isCapturing
          ? "Capturando..."
          : isReady
            ? "Autenticar Huella"
            : "Conectando..."}
      </Button>
      {!isReady && <p>Conectando con el lector de huellas...</p>}
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #555;
`;
