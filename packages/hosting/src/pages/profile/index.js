import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Title from "antd/lib/typography/Title";
import { Tabs, Tag } from "../../components";
import { ProfileDataForm } from "./ProfileDataForm";
import { ProfileImagesForm } from "./ProfileImagesForm";
import ProfileInformation from "./ProfileInformation";

const items = [
  {
    key: "1",
    label: "Editar perfil",
    children: <ProfileDataForm />,
  },
  {
    key: "2",
    label: "Imagen DNI, CIP y firma",
    children: <ProfileImagesForm />,
  },
];
export const Profile = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Perfil</Title>
      </Col>

      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Title level={4}>Datos del usuario</Title>
            <ProfileInformation />
          </Col>
          <Col span={24} md={12}>
            <Title level={4}>Editar Datos</Title>
            <Tabs items={items} defaultActiveKey="1" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
