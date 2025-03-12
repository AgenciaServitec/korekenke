import React from "react";
import { Col, Row, Title, Divider } from "../../components";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Contact = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title>CONTÁCTANOS</Title>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={24} sm={16}>
          <Title level={3} margin={0} className="contact-text">
            Korekenke ha servido con orgullo a clientes que buscan asesoría en
            Intercambios 1031 como Intermediarios Calificados, brindando un
            servicio de precisión y excelencia durante más de 18 años. A menudo,
            nos reunimos personalmente con los clientes y participamos como
            ponentes en eventos educativos sobre Intercambios Diferidos de
            Impuestos.{"\n"}
            {"\n"}
            Emain: info@atlas1033.com{"\n"}
            {"\n"}
            Phone: 1-800-227-1031{"\n"}
            {"\n"}
            Fax: 1-850-201-6911{"\n"}
            {"\n"}
            Korekenke Office{"\n"} 1816 Bimini Drive, Orlando, FL 32806 (View
            Naples)
          </Title>
        </Col>
        <Col span={24} sm={8}>
          <Title level={3} margin={0} className="contact-title-box">
            Contactanos 958 742 157
          </Title>
          {/*<FontAwesomeIcon icon={faEnvelope} size="3x" />*/}
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
  //.contact-list {
  //  list-style: none;
  //  padding: 0;
  //  margin: 0;
  //}
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
    padding: 20px;
  }
`;
