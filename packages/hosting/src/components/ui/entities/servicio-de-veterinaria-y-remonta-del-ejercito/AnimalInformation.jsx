import React from "react";
import { Col, Row } from "../../../ui";
import { calcAges } from "../../../../utils";

export const AnimalInformation = ({ animal }) => {
  const animalAges = calcAges(animal.birthdate);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12}>
        Nombre: <strong className="capitalize">{animal?.name || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Edad:
        <strong>{` ${animalAges?.years} años  (${animalAges?.months} meses)`}</strong>
      </Col>
      <Col span={24} md={12}>
        N° Matrícula:{" "}
        <strong className="capitalize">
          {animal?.registrationNumber || ""}
        </strong>
      </Col>
      <Col span={24} md={12}>
        N° Chip: <strong>{animal?.chipNumber || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Sexo:
        <strong className="capitalize">
          {" "}
          {animal.gender === "male" ? "Macho" : "Hembra"}
        </strong>
      </Col>
      <Col span={24} md={12}>
        Raza o Tipo:{" "}
        <strong className="capitalize">{animal?.raceOrLine || ""}</strong>
      </Col>
      <Col span={24} md={12}>
        Pelaje:
        <strong className="capitalize"> {animal?.fur || ""}</strong>
      </Col>
    </Row>
  );
};
