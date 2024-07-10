import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Title } from "../../../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { mediaQuery } from "../../../../../../styles";
import { Link } from "react-router-dom";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export const Step6DasRequestSuccess = ({ onGoToHome }) => {
  return (
    <Container>
      <Row justify="end" gutter={[16, 16]}>
        <Col span={24}>
          <div className="success-wrapper">
            <FontAwesomeIcon icon={faCircleCheck} size="6x" color="green" />
            <div className="message-wrapper">
              <Title level={4} align="center">
                Felicidades, ha completado su solicitud exitosamente, mantengase
                a la espera de la evaluacion!
              </Title>
              <div>
                <Link to="/entities/departamento-de-apoyo-social/das-requests">
                  <FontAwesomeIcon icon={faLink} size="lg" /> Ver mis
                  solicitudes
                </Link>
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} md={12} lg={6} style={{ margin: "auto" }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => onGoToHome()}
          >
            Ir a inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .success-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    .message-wrapper {
      width: 100%;
      display: grid;
      gap: 1.5em;
      margin: auto auto 1.5em auto;
      text-align: center;
      ${mediaQuery.minTablet} {
        width: 50%;
      }
    }
  }
`;
