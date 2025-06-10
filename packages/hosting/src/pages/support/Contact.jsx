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
          <div className="contact-info">
            <p>
              Korekenke, el ecosistema que gestiona diversos módulos de trámites
              de documentos.
            </p>
            <p>
              <strong>Horario de atención:</strong> <br />
              Lunes a viernes: 9:00am - 6:00pm <br />
              Sábados y domingos: Fuera de atención
            </p>
            <p>
              Teléfono: <strong>929 054 672</strong>
            </p>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="contact-actions">
            <a
              className="contact-whatsapp"
              href="https://api.whatsapp.com/send?phone=51929054672"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faWhatsapp} /> 929 054 672
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100svh;
  padding: 2rem 1rem;

  .contact-info {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
  }

  .contact-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .contact-whatsapp {
    display: inline-block;
    background-color: #25d3661a;
    border: 2px solid #25d366;
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    font-size: 1.1rem;
    color: #075e54;
    font-weight: 600;
    text-align: center;
    transition: all 0.2s ease-in-out;

    svg {
      margin-right: 0.5rem;
    }

    &:hover {
      background-color: #25d36633;
      transform: scale(1.03);
    }
  }

  @media (max-width: 576px) {
    .contact-info {
      font-size: 0.95rem;
    }

    .contact-whatsapp {
      width: 100%;
      text-align: center;
    }
  }
`;
