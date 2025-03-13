import React from "react";
import styled from "styled-components";
import { GetFaceBiometrics } from "./GetFaceBiometrics";
import { useDevice } from "../../../hooks";
import { useModal } from "../../../providers";
import { Button } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { mediaQuery } from "../../../styles";
import { GetFingerprintBiometrics } from "./GetFingerprintBiometrics";

export const ChooseBiometricVerification = ({
  type,
  onCloseModal,
  userBiometrics,
  userFingerprint,
  onSaveAssistance,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal } = useModal();

  const onShowWebcam = () => {
    onShowModal({
      title: "Reconocimiento Facial",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      onRenderBody: () => (
        <GetFaceBiometrics
          type={type}
          onCloseModal={onCloseModal}
          userBiometrics={userBiometrics}
          onSaveAssistance={onSaveAssistance}
        />
      ),
    });
  };

  const onShowFingerprintValidate = () => {
    onShowModal({
      title: "Reconocimiento con huella Digital",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      onRenderBody: () => (
        <GetFingerprintBiometrics
          type={type}
          onCloseModal={onCloseModal}
          userFingerprint={userFingerprint}
          onSaveAssistance={onSaveAssistance}
        />
      ),
    });
  };

  return (
    <Container>
      <Button className="styled-button" onClick={() => onShowWebcam(type)}>
        RECONOCIMIENTO FACIAL
        <FontAwesomeIcon icon={faFaceSmile} size="4x" />
      </Button>
      <Button
        className="styled-button"
        onClick={() => onShowFingerprintValidate(type)}
      >
        HUELLA DACTILAR
        <FontAwesomeIcon icon={faFingerprint} size="4x" />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  ${mediaQuery.maxMobile} {
    display: grid;
  }
  .styled-button {
    display: grid;
    justify-items: center;
    height: 8em;
  }
`;
