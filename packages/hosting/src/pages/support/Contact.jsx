import React from "react";
import { Col, Row, Title } from "../../components";
import styled from "styled-components";

export const Contact = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title>Contacto</Title>
        </Col>
        <Col span={24}>
          <ul className="contact-list">
            <li>
              Teléfono: <strong>941801827</strong>
            </li>
            <li>
              Email: <strong>contacto@gmail.com</strong>
            </li>
          </ul>
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
