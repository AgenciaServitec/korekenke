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
import { usersRef } from "../../firebase/collections";
import { firestoreTimestamp } from "../../firebase/firestore";
import moment from "moment";
import { orderBy } from "lodash";

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
      await onSaveUser(role);
    } finally {
      setOpenDropdown(false);
      setIsChangeRole(false);
    }
  };

  const onSaveUser = async (role) => {
    await usersRef.doc(authUser.id).update({
      defaultRoleCode: role.code,
      otherRoles: orderBy(
        [
          ...authUser.otherRoles.filter((_role) => _role.code !== role.code),
          { ...role, updateAt: moment().format("YYYY-MM-DD HH:mm:ss") },
        ],
        "updateAt",
        "desc"
      ),
    });
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
            onLogout={logout}
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
