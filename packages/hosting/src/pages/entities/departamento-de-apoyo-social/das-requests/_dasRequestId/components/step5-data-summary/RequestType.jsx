import React from "react";
import { Col, Row } from "../../../../../../../components";
import styled from "styled-components";
import { findDasRequest } from "../../../../../../../utils";

export const RequestType = ({ dasRequest }) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24} sm={12}>
          <div className="wrapper-item">
            <span className="label">Tipo</span>
            <span className="value">
              {findDasRequest(dasRequest?.requestType)?.name}
            </span>
          </div>
        </Col>
        <Col span={24} sm={12}>
          <div className="wrapper-item">
            <span className="label">Solicitud para</span>
            <span className="value capitalize">
              {dasRequest?.to === "headline" ? "Titular" : "Familiar"}
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
