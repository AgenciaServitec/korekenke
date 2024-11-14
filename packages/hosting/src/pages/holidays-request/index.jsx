import React from "react";
import styled from "styled-components";
import { HolidaysTable } from "./holidaysTable";
import { Acl, Row, Col, Title } from "../../components";
import { useNavigate } from "react-router";

export const HolidaysRequestIntegration = () => {
  return <HolidayList />;
};

const HolidayList = () => {
  return (
      <Acl
          category="public"
          subCategory="holidaysRequest"
          name="/holidays-request"
          redirect
      >
        <Container>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="header-content">
                <Title level={3}>Lista de Peticiones</Title>
              </div>
            </Col>
            <Col span={24}>
              <HolidaysTable />
            </Col>
          </Row>
        </Container>
      </Acl>

  );
};

const Container = styled.div`
  .header-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
  }
`;
