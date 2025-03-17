import React from "react";
import { Col, Divider, Row, Title } from "../../components";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const Contact = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title>Contacto</Title>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={24} sm={16}>
          <p>
            Korekenke, el ecosistema que gestión diversos módulos de trámites de
            documentos
          </p>
          <p>
            <strong>Horario de atencion:</strong> <br />
            Lunes - viernes: 9:00am - 6:00pm <br />
            Sábados - domingos: Fuera de atención
          </p>
          {/*          <p>
            Correo: <strong>info@atlas1033.com</strong>
          </p>*/}
          <p>
            Teléfono: <strong>929 054 672</strong>
          </p>
        </Col>
        <Col span={24} sm={8}>
          <a
            className="contact-title-box"
            href="https://api.whatsapp.com/send?phone=51929054672"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} /> 929 054 672
          </a>
        </Col>
      </Row>
      <Col span={24}>
        <Title></Title>
      </Col>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100svh;

  .contact-text {
    font-size: 14px;
    white-space: pre-line;
  }

  .contact-title-box {
    border: 2px solid rgba(0, 128, 0, 0.5);
    background-color: rgba(0, 128, 0, 0.1);
    border-radius: 5px;
    display: inline-block;
    text-align: center;
    padding: 0.7em 1em;
    font-size: 1.2em;
    font-weight: 600;
    color: #000;
  }
`;
