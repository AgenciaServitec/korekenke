import React, { useEffect, useState } from "react";
import { Acl, Col, Row } from "../../../components";
import { useAuthentication } from "../../../providers";
import { useUserLocation } from "../../../hooks";
import { GetAssistance } from "./GetAssistance";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

export const AssistanceIntegration = () => {
  const { authUser } = useAuthentication();

  return <Assistance user={authUser} />;
};

const Assistance = ({ user }) => {
  const { userLocation } = useUserLocation();

  const showAlert = !user?.workPlace;

  const [currentDateTime, setCurrentDateTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm:ss A"),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs().format("DD/MM/YYYY HH:mm:ss A"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Acl
        redirect
        category="default"
        subCategory="assistances"
        name="/assistances/assistance"
      >
        <div className="datetime">
          <p>
            <strong>{currentDateTime}</strong>
          </p>
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
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <GetAssistance user={user} userLocation={userLocation} />
          </Col>
        </Row>
      </Acl>
    </Container>
  );
};

const Container = styled.div`
  .datetime {
    text-align: right;
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
