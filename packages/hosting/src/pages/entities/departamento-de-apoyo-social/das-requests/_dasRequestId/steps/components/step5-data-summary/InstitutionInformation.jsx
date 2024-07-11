import React from "react";
import { Col, Row } from "../../../../../../../../components";
import styled from "styled-components";
import { ProcessTypeInInstitution } from "../../../../../../../../data-list";

export const InstitutionInformation = ({ institution }) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Tipo de proceso</span>
            <span className="value capitalize">
              {ProcessTypeInInstitution[institution?.processType]?.name}
            </span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Institución</span>
            <span className="value capitalize">{institution?.name}</span>
          </div>
        </Col>
        <Col span={24} sm={8}>
          <div className="wrapper-item">
            <span className="label">Especialidad</span>
            <span className="value capitalize">{institution?.specialty}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
