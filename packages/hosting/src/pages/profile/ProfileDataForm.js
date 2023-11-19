import React from "react";
import { Button, Form, Input } from "../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

export const ProfileDataForm = () => {
  return (
    <Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input label="Nombres" />
        </Col>
        <Col span={24} md={12}>
          <Input label="Apellido paterno" />
        </Col>

        <Col span={24} md={12}>
          <Input label="Apellido materno" />
        </Col>
      </Row>

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
