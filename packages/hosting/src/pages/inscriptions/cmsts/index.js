import React from "react";
import { CmstsFamilyForm } from "./CmstsFamilyForm";
import { CmstsForm } from "./CmstsForm";
import { Col, Row } from "antd/lib";

export const CmstsIntegration = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <CmstsForm />
      </Col>
      <Col span={24}>
        <CmstsFamilyForm />
      </Col>
    </Row>
  );
};
