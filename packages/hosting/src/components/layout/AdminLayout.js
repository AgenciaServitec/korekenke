import React, { useState } from "react";
import styled from "styled-components";
import { DrawerLayout } from "./DrawerLayout";
import { HeaderLayout } from "./HeaderLayout";
import { FooterLayout } from "./FooterLayout";
import { useNavigate } from "react-router";
import { BreadcrumbLayout } from "./Breadcrumb";
import { useAuthentication, useCommand } from "../../providers";
import { Spin, Layout } from "../ui";

const { Content } = Layout;

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthentication();
  const { currentCommand, onChangeCommand } = useCommand();

  const [isChangeCommand, setIsChangeCommand] = useState(false);
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const onNavigateTo = (url) => navigate(url);

  const onChangeDefaultCommand = async (command) => {
    try {
      setIsChangeCommand(true);
      onChangeCommand(command.id);
    } finally {
      setOpenDropdown(false);
      setIsChangeCommand(false);
    }
  };

  return (
    <Spin tip="Cargando..." spinning={isChangeCommand} className="spin-item">
      <LayoutContainer>
        <Layout className="site-layout">
          <DrawerLayout
            user={authUser}
            isVisibleDrawer={isVisibleDrawer}
            onSetIsVisibleDrawer={setIsVisibleDrawer}
            currentCommand={currentCommand}
            onNavigateTo={onNavigateTo}
          />
          <HeaderLayout
            user={authUser}
            onNavigateTo={onNavigateTo}
            isVisibleDrawer={isVisibleDrawer}
            setIsVisibleDrawer={setIsVisibleDrawer}
            openDropdown={openDropdown}
            onOpenDropdown={setOpenDropdown}
            onChangeDefaultCommand={onChangeDefaultCommand}
            currentCommand={currentCommand}
            onLogout={logout}
          />
          <Content style={{ margin: "0 16px" }}>
            <BreadcrumbLayout user={authUser} />
            <div className="site-layout-background" style={{ padding: 24 }}>
              {children}
            </div>
          </Content>
          <FooterLayout />
        </Layout>
      </LayoutContainer>
    </Spin>
  );
};

const LayoutContainer = styled(Layout)`
  min-width: 100vw;
  min-height: 100vh;
  .site-layout-background {
    background: #fff;
  }

  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
  }
`;
