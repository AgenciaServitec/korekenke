import React from "react";
import { Button, Col, MapComponent, Row } from "../../../components";
import styled from "styled-components";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mediaQuery } from "../../../styles";

export const GetAssistance = ({
  userLocation,
  onShowWebcam,
  entryButtonActive,
  outletButtonActive,
  onSetIsGeofenceValidate,
}) => {
  return (
    <AssistanceButtons
      userLocation={userLocation}
      onShowWebcam={onShowWebcam}
      entryButtonActive={entryButtonActive}
      outletButtonActive={outletButtonActive}
      onSetIsGeofenceValidate={onSetIsGeofenceValidate}
    />
  );
};

const AssistanceButtons = ({
  userLocation,
  onShowWebcam,
  entryButtonActive,
  outletButtonActive,
  onSetIsGeofenceValidate,
}) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} md={8}>
          <div className="buttons">
            <Button
              onClick={() => onShowWebcam("entry")}
              disabled={!entryButtonActive}
              className={`entry-btn ${!entryButtonActive ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              Marcar Ingreso
            </Button>
            <Button
              onClick={() => onShowWebcam("outlet")}
              disabled={!outletButtonActive}
              className={`outlet-btn ${!outletButtonActive ? "disabled" : ""}`}
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
              onGeofenceValidate={onSetIsGeofenceValidate}
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
  padding: 1em;
  border-radius: 1em;
  border: 1px solid rgba(125, 152, 183, 0.47);

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
    background-color: #308132 !important;
    color: #fff !important;
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
    background-color: #a85050 !important;
    color: #fff !important;
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
    border-radius: 0.3em;
    padding: 0.3em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    place-items: center;
  }

  .map-container .leaflet-container {
    border-radius: 8px;
  }

  ${mediaQuery.maxTablet} {
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

  ${mediaQuery.maxMobile} {
    .map-container {
      height: 100vh;
    }

    .entry-btn,
    .outlet-btn {
      width: 100%;
    }
  }
`;
