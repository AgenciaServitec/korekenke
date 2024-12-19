import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Flex,
  Row,
  Col,
  Button,
  notification,
  MapComponent,
} from "../../components";
import {
  addAssistance,
  fetchAssistancesByUserId,
  getAssistancesId,
} from "../../firebase/collections/assistance";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";
import { useDefaultFirestoreProps } from "../../hooks";
import styled from "styled-components";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { omit } from "lodash";

export const GetAssistance = ({ user, userLocation }) => {
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
    const currentDate = dayjs().format(DATE_FORMAT_TO_FIRESTORE);

    try {
      const assistancesToday = await fetchAssistancesByUserId(user.id);
      const existingEntry = assistancesToday.some(
        (assistance) =>
          assistance.date === currentDate && assistance.type === "entry",
      );
      const existingOutlet = assistancesToday.some(
        (assistance) =>
          assistance.date === currentDate && assistance.type === "outlet",
      );
      if (type === "entry" && existingEntry) {
        return notification({
          type: "warning",
          message: "Ya ha marcado su ingreso hoy",
        });
      }

      if (type === "outlet" && existingOutlet) {
        return notification({
          type: "warning",
          message: "Ya ha marcado su salida hoy",
        });
      }
      const assistanceData = {
        userId: user.id,
        id: assistanceId || getAssistancesId(),
        type: type,
        date: currentDate,
        user: omit(user, "acls"),
      };
      await addAssistance(assignCreateProps(assistanceData));
      notification({ type: "success" });

      if (type === "entry") {
        setIsEntry(true);
      } else if (type === "outlet") {
        setIsOutlet(true);
      }
    } catch (error) {
      notification({ type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchTodayAssistance = async () => {
      const currentDate = dayjs().format(DATE_FORMAT_TO_FIRESTORE);
      const assistanceToday = await fetchAssistancesByUserId(user.id);

      const existingEntry = assistanceToday.some(
        (assistance) =>
          assistance.date === currentDate && assistance.type === "entry",
      );

      const existingOutlet = assistanceToday.some(
        (assistance) =>
          assistance.date === currentDate && assistance.type === "outlet",
      );

      setIsEntry(existingEntry);
      setIsOutlet(existingOutlet);
      setIsLoading(false);
    };

    fetchTodayAssistance();
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
}) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} md={8}>
          <div className="buttons">
            <Button
              onClick={() => handleMarkAssistance("entry")}
              disabled={
                isLoading ||
                isEntry ||
                !isWithinGeofence ||
                isOutlet ||
                isProcessing
              }
              className={`entry-btn ${isLoading || isEntry || !isWithinGeofence || isOutlet || isProcessing ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              Marcar Ingreso
            </Button>
            <Button
              onClick={() => handleMarkAssistance("outlet")}
              disabled={
                isLoading ||
                isOutlet ||
                !isWithinGeofence ||
                !isEntry ||
                isProcessing
              }
              className={`outlet-btn ${isLoading || isOutlet || !isWithinGeofence || !isEntry || isProcessing ? "disabled" : ""}`}
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
  height: auto;
  padding: 20px;
  background: #fafafa;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;

  .buttons {
    width: 100%;
    height: 100%;
    align-content: center;
  }

  .entry-btn,
  .outlet-btn {
    padding: 90px 40px;
    font-size: 1.5rem;
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
    height: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .map-container .leaflet-container {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .map-container {
      height: 300px;
    }

    .entry-btn,
    .outlet-btn {
      width: 48%;
      margin-bottom: 10px;
    }

    .outlet-btn {
      order: 1;
    }
  }

  @media (max-width: 480px) {
    .map-container {
      height: 250px;
    }

    .entry-btn,
    .outlet-btn {
      width: 100%;
    }
  }

  @media (max-width: 350px) {
    .entry-btn,
    .outlet-btn {
      padding: 10px 30px;
      font-size: 1rem;
    }
  }
`;
