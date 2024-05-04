import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faBuilding,
  faFileAlt,
  faHome,
  faIdCard,
  faUsers,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { includes } from "lodash";

export const DrawerLayout = ({
  user,
  isVisibleDrawer,
  onSetIsVisibleDrawer,
  onNavigateTo,
}) => {
  const existPageAclsInAclsOfUser = (aclNames = []) =>
    (user?.acls || []).some((acl) => includes(aclNames, acl));

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/home"]),
      onClick: () => {
        onNavigateTo("/home");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Lista Control de Accesos (acls)",
      key: "group-acls",
      icon: <FontAwesomeIcon icon={faUsersCog} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/access-control-list"]),
      children: [
        {
          label: "Acls de roles predeterminados",
          key: "default-roles-acls",
          isVisible: existPageAclsInAclsOfUser(["/default-roles-acls"]),
          onClick: () => {
            onNavigateTo("/default-roles-acls");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Administrardor Acls",
          key: "manage-acls",
          isVisible: existPageAclsInAclsOfUser(["/manage-acls"]),
          onClick: () => {
            onNavigateTo("/manage-acls");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
    {
      label: "Núcleos",
      key: "entities",
      icon: <FontAwesomeIcon icon={faBuilding} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/entities"]),
      onClick: () => {
        onNavigateTo("/entities");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Departamentos",
      key: "departments",
      icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/departments"]),
      onClick: () => {
        onNavigateTo("/departments");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Usuarios",
      key: "users",
      icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/users"]),
      onClick: () => {
        onNavigateTo("/users");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Correspondencias",
      key: "correspondences",
      icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/correspondences"]),
      onClick: () => {
        onNavigateTo("/correspondences");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Inscripciones",
      key: "inscriptions",
      icon: <FontAwesomeIcon icon={faIdCard} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(["/inscriptions"]),
      children: [
        {
          key: "military-circle",
          label: "Circulo Militar",
          isVisible: existPageAclsInAclsOfUser(["/inscriptions/cmsts"]),
          onClick: () => {
            onNavigateTo("/inscriptions/cmsts");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
  ];

  const filterByRoleCode = (items) => {
    return items.filter((item) => {
      if (item?.children) {
        item.children = (item?.children || []).filter(
          (_children) => _children.isVisible
        );
      }

      return item.isVisible;
    });
  };

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
