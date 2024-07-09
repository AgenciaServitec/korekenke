import React from "react";
import { Col, Row } from "../../../../../../../components";
import styled from "styled-components";
import { Relationships } from "../../../../../../../data-list";

export const FamiliarInformation = ({ familiar }) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Nombres</span>
            <span className="value capitalize">{familiar?.firstName}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Apellido paterno</span>
            <span className="value capitalize">
              {familiar?.paternalSurname}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Apellido materno</span>
            <span className="value capitalize">
              {familiar?.maternalSurname}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">N° CIF</span>
            <span className="value capitalize">{familiar?.cif}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Email</span>
            <span className="value">{familiar?.email || ""}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Parentesco</span>
            <span className="value capitalize">
              {Relationships?.[familiar?.relationship] || ""}
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
