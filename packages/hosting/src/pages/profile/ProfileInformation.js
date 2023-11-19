import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

const ProfileInformation = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <DescriptionItem title="Nombres" content="Servitec" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="Apellido Paterno" content="Servitec" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="Apellido Materno" content="Servitec" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="DNI" content="123456" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="CIP" content="654321" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="Email" content="Servitec@email.com" />
      </Col>
      <Col span={24} md={12}>
        <DescriptionItem title="Celular" content="987654321" />
      </Col>
    </Row>
  );
};

const DescriptionItem = ({ title, content }) => (
  <span
    style={{
      marginBottom: "7px",
      color: "rgba(0, 0, 0, 0.85)",
      fontSize: "14px",
      lineHeight: "1.5715",
    }}
  >
    <p
      style={{
        display: "inline-block",
        marginRight: "8px",
        marginBottom: "0",
        color: "rgba(0, 0, 0, 0.65)",
        fontSize: "0.9em",
      }}
    >
      {title}:
    </p>
    {content}
  </span>
);
export default ProfileInformation;
