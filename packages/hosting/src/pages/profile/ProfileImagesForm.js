import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Button, Form } from "../../components";

export const ProfileImagesForm = () => {
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row></Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" size="large" block htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
