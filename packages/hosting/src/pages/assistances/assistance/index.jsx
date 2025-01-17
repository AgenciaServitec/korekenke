import React, { useEffect, useState } from "react";
import { Acl, Col, notification, Row } from "../../../components";
import { ModalProvider, useAuthentication, useModal } from "../../../providers";
import {
  useDefaultFirestoreProps,
  useDevice,
  useUserLocation,
} from "../../../hooks";
import { GetAssistance } from "./GetAssistance";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addAssistance,
  assistancesRef,
  fetchTodayAssistancesByUserId,
  getAssistancesId,
} from "../../../firebase/collections/assistance";
import { GetFaceBiometrics } from "./GetFaceBiometrics";
import { ClockRealTime } from "../../../components/ui/ClockRealTime";
import dayjs from "dayjs";
import { omit } from "lodash";
import { useParams } from "react-router";

export const AssistanceIntegration = () => {
  const { authUser } = useAuthentication();
  const { assistanceId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [entryButtonActive, setEntryButtonActive] = useState(false);
  const [outletButtonActive, setOutletButtonActive] = useState(false);

  const [isGeofenceValidate, setIsGeofenceValidate] = useState(false);

  const [assistances = []] = useCollectionData(
    assistancesRef.where("isDeleted", "==", false),
  );

  const limitMarkedAssistance = async (type, currentDate) => {
    const todayAssistancesUser = await fetchTodayAssistancesByUserId(
      authUser.id,
    );

    return todayAssistancesUser.some(
      (assistance) =>
        assistance.type === type && assistance.date === currentDate,
    );
  };

  const fetchTodayAssistance = async () => {
    const currentDate = dayjs().format("DD/MM/YYYY");

    const isMarkedEntry = await limitMarkedAssistance("entry", currentDate);

    const isMarkedOutlet = await limitMarkedAssistance("outlet", currentDate);

    setEntryButtonActive(
      isMarkedEntry || isMarkedOutlet || !isGeofenceValidate,
    );
    setOutletButtonActive(
      isMarkedOutlet || !isMarkedEntry || !isGeofenceValidate,
    );
  };

  useEffect(() => {
    (async () => {
      await fetchTodayAssistance();
    })();
  }, [authUser.id, isGeofenceValidate]);

  const onSaveAssistance = async (type) => {
    try {
      const currentDate = dayjs().format("DD/MM/YYYY");

      const isMarkedAssistant = await limitMarkedAssistance(type, currentDate);

      if (isMarkedAssistant) {
        notification({
          type: "warning",
          message: `Ya ha marcado su ${type === "entry" ? "ingreso" : "salida"} hoy`,
        });
        return;
      }

      const assistanceData = {
        userId: authUser.id,
        id: assistanceId || getAssistancesId(),
        type,
        date: currentDate,
        user: omit(authUser, "acls"),
      };

      await addAssistance(assignCreateProps(assistanceData));

      notification({
        type: "success",
        title: `Ha marcado su ${type === "entry" ? "entrada" : "salida"} correctamente`,
      });
    } catch (error) {
      console.error("AddAssistanceError:", error);
      notification({
        type: "error",
      });
    }
  };

  return (
    <ModalProvider>
      <Assistance
        user={authUser}
        assistances={assistances}
        onSaveAssistance={onSaveAssistance}
        entryButtonActive={entryButtonActive}
        outletButtonActive={outletButtonActive}
        onSetIsGeofenceValidate={setIsGeofenceValidate}
      />
    </ModalProvider>
  );
};

const Assistance = ({
  user,
  assistances,
  onSaveAssistance,
  outletButtonActive,
  entryButtonActive,
  onSetIsGeofenceValidate,
}) => {
  const { userLocation } = useUserLocation();
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const showAlert = !user?.workPlace;
  const showAlert2 = !user?.biometricVectors;

  const onShowWebcam = (type) => {
    onShowModal({
      title: "Reconocimiento Facial",
      width: `${isTablet ? "60%" : "30%"}`,
      onRenderBody: () => (
        <GetFaceBiometrics
          type={type}
          onCloseModal={onCloseModal}
          user={user}
          onSaveAssistance={onSaveAssistance}
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
              <ClockRealTime />
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
              onShowWebcam={onShowWebcam}
              entryButtonActive={entryButtonActive}
              outletButtonActive={outletButtonActive}
              onSetIsGeofenceValidate={onSetIsGeofenceValidate}
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
