import React, { useEffect } from "react";
import { Acl, Row, Col, Title, notification, Spinner } from "../../components";
import { useAuthentication } from "../../providers";
import { useUserLocation } from "../../hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../firebase/collections/assistance";
import { GetAssistance } from "./GetAssistance";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

export const AssistanceIntegration = () => {
  const { authUser } = useAuthentication();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  if (assistancesLoading) return <Spinner height="80svh" />;

  return <Assistance user={authUser} />;
};

const Assistance = ({ user }) => {
  const { userLocation } = useUserLocation();

  const showAlert = !user?.workPlace;

  const currentDateTime = dayjs().format("DD/MM/YYYY HH:mm A");

  return (
    <Container>
      <Acl
        redirect
        category="default"
        subCategory="assistance"
        name="/assistance"
      >
        <div className="datetime">
          <p>
            <strong>Fecha y hora:</strong> {currentDateTime}
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
            <Title level={3}>Control de asistencia</Title>
          </Col>
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
