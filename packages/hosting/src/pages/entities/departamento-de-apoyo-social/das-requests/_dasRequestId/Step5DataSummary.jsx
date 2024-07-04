import React from "react";
import styled from "styled-components";
import { Button, Card, Col, Row, Title } from "../../../../../components";

export const Step5DataSummary = ({ onPrevStep, onNextStep }) => {
  return (
    <Container>
      <Row justify="end" gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Detalle de datos</Title>
        </Col>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Datos de titular</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
              asperiores dolor doloribus ducimus ea eius est excepturi incidunt
              itaque molestiae mollitia natus quod, reiciendis sit, temporibus!
              Ipsa labore laudantium saepe?
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="primary" size="large" block onClick={onPrevStep}>
            Atras
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="primary" size="large" block onClick={onNextStep}>
            Enviar mi solicitud
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
