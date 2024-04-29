import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faFileAlt,
  faHome,
  faIdCard,
  faUsers,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DrawerLayout = ({
  user,
  isVisibleDrawer,
  onSetIsVisibleDrawer,
  onNavigateTo,
}) => {
  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/home");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Lista Control de Accesos (acls)",
      key: "group-acls",
      icon: <FontAwesomeIcon icon={faUsersCog} size="lg" />,
      isVisible: true,
      children: [
        {
          label: "Acls de roles predeterminados",
          key: "default-roles-acls",
          isVisible: true,
          onClick: () => {
            onNavigateTo("/default-roles-acls");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Administrardor Acls",
          key: "manage-acls",
          isVisible: true,
          onClick: () => {
            onNavigateTo("/manage-acls");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
    {
      label: "Usuarios",
      key: "users",
      icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/users");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Correspondencias",
      key: "correspondences",
      icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/correspondences");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Inscripciones",
      key: "inscriptions",
      icon: <FontAwesomeIcon icon={faIdCard} size="lg" />,
      isVisible: true,
      children: [
        {
          key: "military-circle",
          label: "Circulo Militar",
          onClick: () => {
            onNavigateTo("/inscriptions/cmsts");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
  ];

  const filterByRoleCode = (items) => items.filter((item) => item.isVisible);

  return (
    <DrawerContainer
      key="right"
      title={
        <div style={{ width: "100%", textAlign: "right" }}>
          <h5>version: {version}</h5>
        </div>
      }
      placement="left"
      width={330}
      closable={true}
      onClose={() => onSetIsVisibleDrawer(!isVisibleDrawer)}
      open={isVisibleDrawer}
      className="drawer-content"
      bodyStyle={{ padding: "0" }}
    >
      <div className="logo" />
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={filterByRoleCode(items)}
      />
    </DrawerContainer>
  );
};

const DrawerContainer = styled(Drawer)`
  //background: #fff;
  //.ant-drawer-wrapper-body {
  //  background: #fff !important;
  //  .ant-drawer-body {
  //    padding: 0 !important;
  //    background: #fff !important;
  //  }
  //}
  //.ant-drawer-content-wrapper {
  //  width: 100% !important;
  //  background: #fff;
  //}
`;
