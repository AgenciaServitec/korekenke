import React from "react";
import { CmstsFamilyForm } from "./CmstsFamilyForm";
import { CmstsForm } from "./CmstsForm";
import { Acl, Card, Col, Row } from "../../../../../components";

export const CmstsIntegration = () => {
  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="inscriptions"
      name="/inscriptions/cmsts"
      redirect
    >
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>
                  Circulo Militar de Superiores tecnicos y sub oficiales
                </span>
              }
              bordered={false}
              type="inner"
            >
              <CmstsForm />
            </Card>
          </Col>
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>Composición Familiar</span>
              }
              bordered={false}
              type="inner"
            >
              <CmstsFamilyForm />
            </Card>
          </Col>
        </Row>
      </div>
    </Acl>
  );
};
