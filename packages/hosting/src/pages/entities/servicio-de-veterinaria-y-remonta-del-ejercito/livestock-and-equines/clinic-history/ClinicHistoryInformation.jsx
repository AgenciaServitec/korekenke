import React from "react";
import { Col, Row } from "antd";

export const ClinicHistoryInformation = ({ livestockAndEquine }) => {
  console.log({ livestockAndEquine });
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12}>
        Nombre:
        <strong className="capitalize">{livestockAndEquine?.name || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Sexo:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.gender || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        Color:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.color || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        N° de Matrícula:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.registrationNumber || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        Fecha de Nacimiento:{" "}
        <strong>{livestockAndEquine?.birthdate || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Escuadrón:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.squadron || ""}
        </strong>
      </Col>
    </Row>
  );
};
