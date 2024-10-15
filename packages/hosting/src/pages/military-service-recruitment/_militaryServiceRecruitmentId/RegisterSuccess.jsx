import React from "react";
import { Col, Row, Title } from "../../../components";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { mediaQuery } from "../../../styles";

export const RegisterSuccess = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="success-wrapper">
            <FontAwesomeIcon icon={faThumbsUp} size="6x" />
            <div className="message-wrapper">
              <Title level={4} align="center">
                ¡Felicitaciones por tu registro!
              </Title>
              <p>
                Gracias por tu interés en servir al Ejército del Perú. Nos
                pondremos en contacto contigo cuando haya vacantes disponibles.
              </p>
              <div>
                <Link to="/military-service-recruitment">
                  <FontAwesomeIcon icon={faLink} size="lg" />
                  Ver mi registro
                </Link>
              </div>
            </div>
          </div>
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
        width: 90%;
      }
    }
  }
`;
