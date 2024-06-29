import React from "react";
import { Col, Row, Title } from "../../../../components";
import { DasRequestsListTable } from "./DasRequestsListTable";

export const DasRequestsListIntegration = () => {
  return <DasRequestsList />;
};

const DasRequestsList = () => {
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Title level={3}>Lista de Solicitudes</Title>
      </Col>
      <Col span={24}>
        <DasRequestsListTable />
      </Col>
    </Row>
  );
};
