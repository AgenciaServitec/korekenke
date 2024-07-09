import React from "react";
import { Col, Row, Title, Divider } from "../../../../../../../components";
import { findDegree } from "../../../../../../../utils";
import styled from "styled-components";
import { FamiliarInformation } from "./FamiliarInformation";
import { isEmpty } from "lodash";

export const PersonalInformation = ({ dasRequest }) => {
  const { headline, familiar } = dasRequest;

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Nombres</span>
            <span className="value capitalize">{headline?.firstName}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Apellido paterno</span>
            <span className="value capitalize">
              {headline?.paternalSurname}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Apellido materno</span>
            <span className="value capitalize">
              {headline?.maternalSurname}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">N° CIP</span>
            <span className="value capitalize">{headline?.cip}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Grado</span>
            <span className="value capitalize">
              {findDegree(headline?.degree)?.label || ""}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Teléfono</span>
            <span className="value capitalize">
              {headline?.phone.number || ""}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Servicio actual</span>
            <span className="value capitalize">
              {headline?.currentService || ""}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Email</span>
            <span className="value">{headline?.email || ""}</span>
          </div>
        </Col>
      </Row>
      {!isEmpty(familiar) && (
        <>
          <Divider />
          <Row>
            <Col span={24}>
              <Title level={4}>Familiar</Title>
            </Col>
            <Col span={24}>
              <FamiliarInformation familiar={familiar} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
