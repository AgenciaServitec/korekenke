import React, { useEffect, useState } from "react";
import { Acl, Col, Row } from "../../../components";
import { ModalProvider, useAuthentication, useModal } from "../../../providers";
import { useDevice, useUserLocation } from "../../../hooks";
import { GetAssistance } from "./GetAssistance";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../../firebase/collections/assistance";
import { GetFaceBiometrics } from "./GetFaceBiometrics";

export const AssistanceIntegration = () => {
  const { authUser } = useAuthentication();

  useEffect(() => {}, []);

  const [assistances = []] = useCollectionData(
    assistancesRef.where("isDeleted", "==", false),
  );

  return (
    <ModalProvider>
      <Assistance user={authUser} assistances={assistances} />
    </ModalProvider>
  );
};

const Assistance = ({ user, assistances }) => {
  const { userLocation } = useUserLocation();
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm:ss A"),
  );

  const showAlert = !user?.workPlace;
  const showAlert2 = !user?.biometricVectors;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs().format("DD/MM/YYYY HH:mm:ss A"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onShowWebcam = () => {
    onShowModal({
      title: "Reconocimiento Facial",
      width: `${isTablet ? "60%" : "30%"}`,
      onRenderBody: () => (
        <GetFaceBiometrics
          onCloseModal={onCloseModal}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      ),
    });
  };

  return (
    <Container>
      <Acl
        redirect
        category="default"
        subCategory="assistances"
        name="/assistances/assistance"
      >
        <div className="superior-section">
          <div className="workPlace">
            <strong>Lugar de trabajo: {user.workPlace}</strong>
          </div>
          <div className="datetime">
            <p>
              <strong>{currentDateTime}</strong>
            </p>
          </div>
        </div>
        {showAlert && (
          <div className="alert-wrapper">
            <p>
              <strong>Atención:</strong> No tienes un lugar de trabajo
              configurado. Por favor, dirígete a tu perfil para agregarlo.
            </p>
            <Link to="/profile" className="alert-link">
              Ir a mi perfil
            </Link>
          </div>
        )}
        {showAlert2 && (
          <div className="alert-wrapper">
            <p>
              <strong>Atención:</strong> No tiene su rostro registrado para el
              reconocimiento facial. Por favor, dirígete a tu perfil para
              agregarlo.
            </p>
            <Link to="/profile" className="alert-link">
              Ir a mi perfil
            </Link>
          </div>
        )}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <GetAssistance
              user={user}
              userLocation={userLocation}
              assistances={assistances}
              onShowWebcam={onShowWebcam}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          </Col>
        </Row>
      </Acl>
    </Container>
  );
};

const Container = styled.div`
  .superior-section {
    justify-content: space-between;
    display: flex;
  }
  .workPlace {
    font-size: 1.4em;

    @media (max-width: 768px) {
      font-size: 1.2em;
      text-align: center;
    }

    @media (max-width: 480px) {
      font-size: 1em;
      text-align: left;
    }
  }
  .datetime {
    font-size: 1.4em;

    @media (max-width: 768px) {
      font-size: 1.2em;
      text-align: center;
    }

    @media (max-width: 480px) {
      font-size: 1em;
      text-align: left;
    }
  }

  .alert-wrapper {
    background-color: #f8d7da;
    color: #842029;
    padding: 1.5em;
    margin-bottom: 1em;
    border: 1px solid #f5c2c7;
    border-radius: 8px;

    p {
      margin: 0 0 1em 0;
    }

    .alert-link {
      display: inline-block;
      padding: 0.5em 1em;
      background-color: #842029;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }

    .alert-link:hover {
      background-color: #6d1a22;
    }
  }
`;
