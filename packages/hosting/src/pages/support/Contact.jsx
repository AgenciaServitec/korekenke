import React from "react";
import { Col, Row, Title, Divider } from "../../components";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const Contact = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title>¿Datos de contacto?</Title>
        </Col>
        <Divider />
        <Col span={24} sm={12}>
          <FontAwesomeIcon icon={faWhatsapp} size="3x" />
          <Title level={3} margin={0}>
            123456789
          </Title>
        </Col>
        <Col span={24} sm={12}>
          <FontAwesomeIcon icon={faEnvelope} size="3x" />
          <Title level={3} margin={0}>
            contacto@gmail.com
          </Title>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;
