import React, { useState } from "react";
import styled from "styled-components";
import LayoutAntd from "antd/lib/layout";
import { DrawerLayout } from "./DrawerLayout";
import { HeaderLayout } from "./HeaderLayout";
import { FooterLayout } from "./FooterLayout";
import { useNavigate } from "react-router";
import { BreadcrumbLayout } from "./Breadcrumb";
import { useAuthentication } from "../../providers";
import { Spin } from "../ui";

const { Content } = LayoutAntd;

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthentication();

  const [isChangeRole, setIsChangeRole] = useState(false);
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const onNavigateTo = (url) => navigate(url);

  const onChangeDefaultRole = async (role) => {
    try {
      setIsChangeRole(true);
      console.log("role: ", role);
    } finally {
      setOpenDropdown(false);
      setIsChangeRole(false);
    }
  };

  return (
    <Spin tip="Cargando..." spinning={isChangeRole} className="spin-item">
      <LayoutContainer>
        <LayoutAntd className="site-layout">
          <DrawerLayout
            user={authUser}
            isVisibleDrawer={isVisibleDrawer}
            onSetIsVisibleDrawer={setIsVisibleDrawer}
            onNavigateTo={onNavigateTo}
          />
          <HeaderLayout
            user={authUser}
            onNavigateTo={onNavigateTo}
            isVisibleDrawer={isVisibleDrawer}
            setIsVisibleDrawer={setIsVisibleDrawer}
            openDropdown={openDropdown}
            onOpenDropdown={setOpenDropdown}
            onChangeDefaultRole={onChangeDefaultRole}
            onLogout={logout}
          />
          <Content style={{ margin: "0 16px" }}>
            <BreadcrumbLayout user={authUser} />
            <div className="site-layout-background" style={{ padding: 24 }}>
              {children}
            </div>
          </Content>
          <FooterLayout />
        </LayoutAntd>
      </LayoutContainer>
    </Spin>
  );
};

const LayoutContainer = styled(LayoutAntd)`
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
