import React from "react";
import { CmstsFamilyForm } from "./CmstsFamilyForm";
import { CmstsForm } from "./CmstsForm";
import { Col, Row } from "antd/lib";
import Title from "antd/lib/typography/Title";
import { Card } from "../../../../../components";
import styled from "styled-components";

export const CmstsIntegration = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Title level={4} style={{ marginBottom: 0 }}>
                Circulo Militar de Superiores tecnicos y sub oficiales
              </Title>
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
              <Title level={4} style={{ marginBottom: 0 }}>
                Composición Familiar
              </Title>
            }
            bordered={false}
            type="inner"
          >
            <CmstsFamilyForm />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  .ant-card-head {
    background: #03a9f32d;

    //.ant-card-head-title {
    //  h4 {
    //    color: #fff;
    //  }
    //}
  }
`;