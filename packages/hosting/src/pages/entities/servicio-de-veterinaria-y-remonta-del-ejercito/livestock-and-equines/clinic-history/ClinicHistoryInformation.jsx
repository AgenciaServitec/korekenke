import React from "react";
import { Col, Row } from "antd";

export const ClinicHistoryInformation = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12}>
        Nombre: Baral Nakatomy
      </Col>
      <Col span={24} md={12}>
        Sexo: C
      </Col>
      <Col span={24} md={12}>
        Color: Castaño
      </Col>
      <Col span={24} md={12}>
        N° de Matrícula: 7-11
      </Col>
      <Col span={24} md={12}>
        Fecha de Nacimiento: 25-09-2007
      </Col>
      <Col span={24} md={12}>
        Escuadrón: B
      </Col>
    </Row>
  );
};
