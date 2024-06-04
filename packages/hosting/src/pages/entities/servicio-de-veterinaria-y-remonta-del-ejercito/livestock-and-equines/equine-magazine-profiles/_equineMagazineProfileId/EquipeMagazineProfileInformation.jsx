import React from "react";
import { Col, Row } from "antd";

export const EquipeMagazineProfileInformation = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12}>
        Nombre del Equino: Caballito
      </Col>
      <Col span={24} md={12}>
        Edad: 10 años y 5 meses
      </Col>
      <Col span={24} md={12}>
        Identificación Individual: T-29
      </Col>
      <Col span={24} md={12}>
        N° Chip: S/N
      </Col>
      <Col span={24} md={12}>
        Sexo: Macho
      </Col>
      <Col span={24} md={12}>
        Raza o Tipo: Remonta Mejorada
      </Col>
      <Col span={24} md={12}>
        Pelaje: Lacio
      </Col>
    </Row>
  );
};
