import React from "react";
import { Button, Col, Row, Title } from "../../../../components";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import { useAuthentication } from "../../../../providers";

export const CompletedQuestionnaire = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();

  const onGoHome = () => navigate("/home");

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col span={24}>
        <Container>
          <div>
            <Title level={4}>
              Felicidades, ha completado la encuesta exitosamente!
            </Title>
          </div>
          <div>
            <FontAwesomeIcon icon={faThumbsUp} size="8x" />
          </div>
        </Container>
      </Col>
      {authUser && (
        <Col xs={24} sm={6} md={4}>
          <Button type="primary" block onClick={onGoHome}>
            Ir al inicio
          </Button>
        </Col>
      )}
    </Row>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
`;
