import React from "react";
import { Col, Row } from "antd";
import dayjs from "dayjs";

export const LivestockAndEquineInformation = ({ livestockAndEquine }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12}>
        Nombre del Equino:{" "}
        <strong className="capitalize">{livestockAndEquine?.name || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Edad:
        <strong>{` ${dayjs().diff(
          dayjs(dayjs(livestockAndEquine.birthdate, "DD/MM/YYYY HH:mm")),
          "years"
        )} años  (${dayjs().diff(
          dayjs(livestockAndEquine.birthdate, "DD/MM/YYYY HH:mm"),
          "months"
        )} meses)`}</strong>
      </Col>
      <Col span={24} md={12}>
        N° Matrícula:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.registrationNumber || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        N° Chip: <strong>{livestockAndEquine?.chipNumber || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Sexo:
        <strong className="capitalize">
          {" "}
          {livestockAndEquine.gender === "male" ? "Macho" : "Hembra"}
        </strong>
      </Col>
      <Col span={24} md={12}>
        Raza o Tipo:{" "}
        <strong className="capitalize">
          {livestockAndEquine?.raceOrLine || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        Pelaje:
        <strong className="capitalize"> {livestockAndEquine?.fur || ""}</strong>
      </Col>
    </Row>
  );
};
