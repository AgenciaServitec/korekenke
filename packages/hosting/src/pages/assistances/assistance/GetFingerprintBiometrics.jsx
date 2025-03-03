import React from "react";
import styled from "styled-components";
import { Button } from "../../../components";

export const GetFingerprintBiometrics = ({
  type,
  onCloseModal,
  onSaveAssistance,
  userFingerprint,
}) => {
  const validate = userFingerprint === userFingerprint;

  const onFingerprintValidate = () => {
    if (validate === true) {
      onSaveAssistance(type);
    }
    onCloseModal();
  };

  return (
    <Container>
      <Button onClick={onFingerprintValidate}>Detectar huella</Button>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #555;
`;
