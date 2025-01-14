import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Col,
  MapComponent,
  notification,
  Row,
} from "../../../components";
import {
  addAssistance,
  fetchTodayAssistancesByUserId,
  getAssistancesId,
} from "../../../firebase/collections/assistance";
import dayjs from "dayjs";
import { useDefaultFirestoreProps } from "../../../hooks";
import styled from "styled-components";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { omit } from "lodash";

export const GetAssistance = ({ user, userLocation, onShowWebcam }) => {
  const { assistanceId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [isEntry, setIsEntry] = useState(false);
  const [isOutlet, setIsOutlet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isWithinGeofence, setIsWithinGeofence] = useState(false);

  const handleMarkAssistance = async (type) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const currentDate = dayjs().format("DD/MM/YYYY");
      const todayAssistancesUser = await fetchTodayAssistancesByUserId(user.id);

      const isMarkedEntry = todayAssistancesUser.some(
        (assistance) =>
          assistance.type === "entry" && assistance.date === currentDate,
      );

      const isMarkedOutlet = todayAssistancesUser.some(
        (assistance) =>
          assistance.type === "outlet" && assistance.date === currentDate,
      );

      if (
        (type === "entry" && isMarkedEntry) ||
        (type === "outlet" && isMarkedOutlet)
      ) {
        return notification({
          type: "warning",
          message: `Ya ha marcado su ${type === "entry" ? "ingreso" : "salida"} hoy`,
        });
      }

      const assistanceData = {
        userId: user.id,
        id: assistanceId || getAssistancesId(),
        type,
        date: currentDate,
        user: omit(user, "acls"),
      };

      await addAssistance(assignCreateProps(assistanceData));
      notification({
        type: "success",
        message: `${type === "entry" ? "Ingreso" : "Salida"} marcada con éxito`,
      });

      type === "entry" ? setIsEntry(true) : setIsOutlet(true);
    } catch (error) {
      console.error("Error marcando asistencia:", error);
      notification({
        type: "error",
        message: "Ocurrió un error al marcar la asistencia",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchTodayAssistance = async () => {
      const currentDate = dayjs().format("DD/MM/YYYY");
      const todayAssistancesUser = await fetchTodayAssistancesByUserId(user.id);

      const isMarkedEntry = todayAssistancesUser.some(
        (assistance) =>
          assistance.type === "entry" && assistance.date === currentDate,
      );

      const isMarkedOutlet = todayAssistancesUser.some(
        (assistance) =>
          assistance.type === "outlet" && assistance.date === currentDate,
      );

      setIsEntry(isMarkedEntry);
      setIsOutlet(isMarkedOutlet);
      setIsLoading(false);
    };

    (async () => {
      await fetchTodayAssistance();
    })();
  }, [user.id]);

  return (
    <AssistanceButtons
      handleMarkAssistance={handleMarkAssistance}
      isEntry={isEntry}
      isOutlet={isOutlet}
      isLoading={isLoading}
      isProcessing={isProcessing}
      userLocation={userLocation}
      isWithinGeofence={isWithinGeofence}
      onGeofenceValidate={setIsWithinGeofence}
      onShowWebcam={onShowWebcam}
    />
  );
};

const AssistanceButtons = ({
  handleMarkAssistance,
  isEntry,
  userLocation,
  isWithinGeofence,
  onGeofenceValidate,
  isOutlet,
  isLoading,
  isProcessing,
  onShowWebcam,
}) => {
  const isEntryBtnDisabled =
    isLoading || isEntry || !isWithinGeofence || isOutlet || isProcessing;

  const isOutletBtnDisabled =
    isLoading || isOutlet || !isWithinGeofence || !isEntry || isProcessing;

  return (
    <Container>
      <button onClick={() => onShowWebcam()}>HOLAAAAAAA</button>
      <Row gutter={[16, 16]}>
        <Col span={24} md={8}>
          <div className="buttons">
            <Button
              onClick={() => handleMarkAssistance("entry")}
              disabled={isEntryBtnDisabled}
              className={`entry-btn ${isEntryBtnDisabled ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              Marcar Ingreso
            </Button>
            <Button
              onClick={() => handleMarkAssistance("outlet")}
              disabled={isOutletBtnDisabled}
              className={`outlet-btn ${isOutletBtnDisabled ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Marcar Salida
            </Button>
          </div>
        </Col>
        <Col span={24} md={16}>
          <div className="map-container">
            <MapComponent
              geofence
              userLocation={userLocation}
              onGeofenceValidate={onGeofenceValidate}
              markers={
                userLocation
                  ? [
                      {
                        lat: userLocation.lat,
                        lng: userLocation.lng,
                        title: "Tu ubicación",
                      },
                    ]
                  : []
              }
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #ddd;

  .buttons {
    width: 100%;
    height: 100%;
    align-content: center;
  }

  .entry-btn,
  .outlet-btn {
    padding: 4em 3em;
    font-size: 2.1rem;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
  }

  .entry-btn {
    background-color: #4caf50;
  }

  .entry-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .entry-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  .entry-btn.disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .outlet-btn {
    background-color: #e57373;
  }

  .outlet-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .outlet-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  .outlet-btn.disabled {
    background-color: #ef9a9a;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .map-container {
    width: 100%;
    height: calc(100vh - 20px);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .map-container .leaflet-container {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .map-container {
      width: 100%;
      height: 100vh;
    }

    .entry-btn,
    .outlet-btn {
      font-size: 1.5rem;
      width: 100%;
      margin-bottom: 10px;
    }

    .outlet-btn {
      order: 1;
    }
  }

  @media (max-width: 480px) {
    .map-container {
      height: 100vh;
    }

    .entry-btn,
    .outlet-btn {
      width: 100%;
    }
  }

  @media (max-width: 350px) {
    .entry-btn,
    .outlet-btn {
      padding: 3em 1em;
      font-size: 1rem;
    }
  }

  @media (orientation: landscape) {
    .map-container {
      height: 90vh;
    }
  }
  @media (orientation: portrait) {
    .map-container {
      height: 50vh;
    }
  }
`;
