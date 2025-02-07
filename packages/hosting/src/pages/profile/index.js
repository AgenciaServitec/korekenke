import React from "react";
import { Acl, Col, Row, Tabs, Title } from "../../components";
import { ProfileDataForm } from "./ProfileDataForm";
import { ProfileImagesForm } from "./ProfileImagesForm";
import { ProfileInformation } from "./ProfileInformation";
import { ModalProvider, useAuthentication } from "../../providers";
import { useQueryString } from "../../hooks";
import { ProfileUserBiometrics } from "./ProfileUserBiometrics";

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
  {
    key: "3",
    label: "Datos Biométricos",
    children: (
      <ModalProvider>
        <ProfileUserBiometrics />
      </ModalProvider>
    ),
  },
];
export const Profile = () => {
  const { authUser } = useAuthentication();

  const [dataEdit, setDataEdit] = useQueryString("dataEdit", "1");

  return (
    <Acl redirect category="default" subCategory="profile" name="/profile">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Perfil</Title>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Title level={4}>Datos del usuario</Title>
              <br />
              <ProfileInformation user={authUser} />
            </Col>
            <Col span={24} md={12}>
              <Title level={4}>Editar Datos</Title>
              <Tabs items={items} defaultActiveKey={dataEdit} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Acl>
  );
};
