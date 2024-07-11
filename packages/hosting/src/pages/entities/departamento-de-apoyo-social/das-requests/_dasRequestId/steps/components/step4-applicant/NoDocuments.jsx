import React from "react";
import styled from "styled-components";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
} from "../../../../../../../../components";

export const NoDocuments = ({ onPrevStep, onNextStep }) => {
  return (
    <Container>
      <Row justify="end" gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <span style={{ fontSize: "1.5em" }}>
                Documentos del Aplicante
              </span>
            }
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              <Alert
                message="Los documentos no son necesarios para esta institución,
                      puedes continuar de manera normal"
                type="info"
                showIcon
                style={{ margin: "auto" }}
              />
            </Row>
          </Card>
        </Col>
        {onPrevStep && (
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" size="large" block onClick={onPrevStep}>
              Atras
            </Button>
          </Col>
        )}
        {onNextStep && (
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" size="large" block onClick={onNextStep}>
              Siguiente
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
