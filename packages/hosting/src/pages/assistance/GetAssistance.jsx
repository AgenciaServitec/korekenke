import React, { useState } from "react";
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
  getAssistancesId,
} from "../../firebase/collections/assistance";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";
import { useDefaultFirestoreProps } from "../../hooks";
import styled from "styled-components";

export const GetAssistance = ({ user, userLocation }) => {
  const { assistanceId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [isEntry, setIsEntry] = useState(false);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);

  const handleMarkAssistance = async (type) => {
    const currentDate = dayjs();

    const assistanceData = {
      id: assistanceId || getAssistancesId(),
      type: type,
      date: dayjs(currentDate).format(DATE_FORMAT_TO_FIRESTORE),
    };

    try {
      await addAssistance(assignCreateProps(assistanceData));
      notification({ type: "success" });

      if (type === "entry") {
        setIsEntry(true);
      } else if (type === "outlet") {
        setIsEntry(false);
      }
    } catch (error) {
      notification({ type: "error" });
    }
  };

  return (
    <AssistanceButtons
      handleMarkAssistance={handleMarkAssistance}
      isEntry={isEntry}
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
}) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Flex gap={5} justify="space-between">
            <Button
              onClick={() => handleMarkAssistance("entry")}
              disabled={isEntry || !isWithinGeofence}
              className={`entry-btn ${isEntry || !isWithinGeofence ? "disabled" : ""}`}
            >
              Marcar Entrada
            </Button>
            <Button
              onClick={() => handleMarkAssistance("outlet")}
              disabled={!isEntry || !isWithinGeofence}
              className={`outlet-btn ${!isEntry || !isWithinGeofence ? "disabled" : ""}`}
            >
              Marcar Salida
            </Button>
          </Flex>
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
  .entry-btn {
    padding: 12px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    color: white;
    background-color: #4caf50;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    padding: 12px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 25px;
    color: white;
    background-color: #e57373;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    margin-top: 20px;
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
      padding: 10px 20px;
      font-size: 1rem;
    }
  }
`;
