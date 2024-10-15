import React from "react";
import { Card, Col, Row } from "../../../components";

export const RecruitedInformation = ({ recruited }) => {
  return (
    <Card
      title={<span style={{ fontSize: "1.5em" }}>Datos del Registrado</span>}
      bordered={false}
      type="inner"
    >
      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          Dni: <strong className="capitalize">{recruited?.dni || ""}</strong>
        </Col>
        <Col span={24} md={12}>
          Nombres:{" "}
          <strong className="capitalize">{recruited?.firstName || ""}</strong>
        </Col>
        <Col span={24} md={12}>
          Apellido Paterno:{" "}
          <strong className="capitalize">
            {recruited?.paternalSurname || ""}
          </strong>
        </Col>
        <Col span={24} md={12}>
          Apellido Materno:{" "}
          <strong className="capitalize">
            {recruited?.maternalSurname || ""}
          </strong>
        </Col>
        <Col span={24} md={12}>
          Celular:{" "}
          <strong className="capitalize">
            {recruited?.phone?.number || ""}
          </strong>
        </Col>
        <Col span={24} md={12}>
          Correo Electrónico: <strong>{recruited?.email || ""}</strong>
        </Col>
        <Col span={24} md={12}>
          Nivel de educación:{" "}
          <strong className="capitalize">
            {recruited?.educationLevel || ""}
          </strong>
        </Col>
      </Row>
    </Card>
  );
};
