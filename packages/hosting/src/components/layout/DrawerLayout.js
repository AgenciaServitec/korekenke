import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faFileAlt,
  faHome,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mediaQuery } from "../../styles";
import { useAuthentication } from "../../providers";

export const DrawerLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  user,
  onNavigateTo,
}) => {
  const { logout } = useAuthentication();

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/home");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Usuarios",
      key: "users",
      icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/users");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Documentos",
      key: "documents",
      icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/documents");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Cerrar sesion",
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} size="lg" />,
      isVisible: true,
      onClick: async () => {
        await logout();
        setIsVisibleDrawer(false);
      },
    },
  ];

  const filterByRoleCode = (items) => items.filter((item) => item.isVisible);

  return (
    <DrawerContainer
      title={
        <div style={{ width: "100%", textAlign: "right" }}>
          <h5>version: {version}</h5>
        </div>
      }
      placement="right"
      closable={true}
      onClose={() => setIsVisibleDrawer(!isVisibleDrawer)}
      open={isVisibleDrawer}
      key="right"
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
  background: #fff;
  .ant-drawer-wrapper-body {
    background: #fff !important;
    .ant-drawer-body {
      background: #fff !important;
    }
  }
  .ant-drawer-content-wrapper {
    width: 100% !important;
    background: #fff;
    ${mediaQuery.minTablet} {
      width: 300px !important;
    }
  }
`;
