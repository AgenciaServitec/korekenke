import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faFileAlt,
  faHome,
  faSignOutAlt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mediaQuery } from "../../styles";
import { useAuthentication } from "../../providers";

export const DrawerLayout = ({
  user,
  isVisibleDrawer,
  onSetIsVisibleDrawer,
  onNavigateTo,
  onLogout,
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
      label: "Perfil",
      key: "profile",
      icon: <FontAwesomeIcon icon={faUser} size="lg" />,
      isVisible: true,
      onClick: () => {
        onNavigateTo("/profile");
        onSetIsVisibleDrawer(false);
      },
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
      label: "Cerrar sesion",
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} size="lg" />,
      isVisible: true,
      onClick: async () => {
        await onLogout();
        onSetIsVisibleDrawer(false);
      },
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
