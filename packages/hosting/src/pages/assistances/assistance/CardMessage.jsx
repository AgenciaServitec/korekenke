import React from "react";
import { Card } from "../../../components/ui";
import styled from "styled-components";
import { CheckCircleOutlined } from "@ant-design/icons";

export const CardMessage = ({ messageType }) => {
  let message = "Registro completado con éxito, soldado.";
  let title = "¡Asistencia Confirmada!";
  let icon = <CheckCircleOutlined />;

  if (messageType === "entry") {
    title = "¡Entrada Confirmada!";
    message = "Has marcado tu entrada correctamente, soldado.";
  } else if (messageType === "outlet") {
    title = "¡Salida Confirmada!";
    message = "Has marcado tu salida correctamente, soldado.";
  }

  return (
    <Container>
      <Card className="card-wrapper">
        <div className="icon-wrapper">{icon}</div>
        <h2>{title}</h2>
        <div className="message">
          <p>{message}</p>
        </div>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  padding-top: 80px;

  .card-wrapper {
    max-width: 500px;
    width: 100%;
    text-align: center;
    border-radius: 20px;
    background: linear-gradient(145deg, #3e4c40, #4b5a50);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    padding: 20px 10px;
    border: 2px solid #2c3a33;
    transition:
      transform 0.4s ease,
      box-shadow 0.4s ease;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
    }
  }

  .icon-wrapper {
    font-size: 80px;
    margin-bottom: 32px;
    animation: pulse 1.5s infinite;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    color: #e6f7ff;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  .message {
    p {
      font-size: 20px;
      color: #d9d9d9;
      margin: 0 0 32px;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
