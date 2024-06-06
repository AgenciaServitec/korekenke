import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faBriefcase,
  faBuildingUser,
  faComputer,
  faFileAlt,
  faGears,
  faHome,
  faHorse,
  faIdCard,
  faNetworkWired,
  faShield,
  faUsers,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { includes, isEmpty } from "lodash";

export const DrawerLayout = ({
  user,
  isVisibleDrawer,
  onSetIsVisibleDrawer,
  onNavigateTo,
}) => {
  const existPageAclsInAclsOfUser = (
    category,
    subCategories = [],
    aclNames = []
  ) =>
    subCategories.map((subCategory) => {
      if (isEmpty(user.acls?.[category]?.[subCategory])) return false;

      return user.acls?.[category]?.[subCategory].some((acl) =>
        includes(aclNames, acl)
      );
    });

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      isVisible: existPageAclsInAclsOfUser("default", ["home"], ["/home"]),
      onClick: () => {
        onNavigateTo("/home");
        onSetIsVisibleDrawer(false);
      },
    },
    {
      label: "Control de Accesos (acls)",
      key: "group-acls",
      icon: <FontAwesomeIcon icon={faUsersCog} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(
        "accessControl",
        ["defaultRolesAcls", "manageAcls"],
        ["/default-roles-acls", "/manage-acls"]
      ),
      children: [
        {
          label: "Roles con Acls",
          key: "default-roles-acls",
          isVisible: existPageAclsInAclsOfUser(
            "accessControl",
            ["defaultRolesAcls"],
            ["/default-roles-acls"]
          ),
          onClick: () => {
            onNavigateTo("/default-roles-acls");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Administrador Acls",
          key: "manage-acls",
          isVisible: existPageAclsInAclsOfUser(
            "accessControl",
            ["manageAcls"],
            ["/manage-acls"]
          ),
          onClick: () => {
            onNavigateTo("/manage-acls");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
    {
      label: "Administración",
      key: "manager",
      icon: <FontAwesomeIcon icon={faGears} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(
        "administration",
        ["users", "entities", "departments", "offices", "sections"],
        ["/users", "/entities", "/departments", "/sections", "/offices"]
      ),
      children: [
        {
          label: "Usuarios",
          key: "users",
          icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "administration",
            ["users"],
            ["/users"]
          ),
          onClick: () => {
            onNavigateTo("/users");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Entidades",
          key: "entities",
          icon: <FontAwesomeIcon icon={faNetworkWired} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "administration",
            ["entities"],
            ["/entities"]
          ),
          onClick: () => {
            onNavigateTo("/entities");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Departamentos",
          key: "departments",
          icon: <FontAwesomeIcon icon={faBuildingUser} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "administration",
            ["departments"],
            ["/departments"]
          ),
          onClick: () => {
            onNavigateTo("/departments");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Secciones",
          key: "sections",
          icon: <FontAwesomeIcon icon={faComputer} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "administration",
            ["sections"],
            ["/sections"]
          ),
          onClick: () => {
            onNavigateTo("/sections");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Oficinas",
          key: "offices",
          icon: <FontAwesomeIcon icon={faBriefcase} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "administration",
            ["offices"],
            ["/offices"]
          ),
          onClick: () => {
            onNavigateTo("/offices");
            onSetIsVisibleDrawer(false);
          },
        },
      ],
    },
    {
      label: "Jefatura de bienestar del ejército (COBIENE)",
      key: "jefatura-de-bienestar-del-ejercito",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(
        "jefatura-de-bienestar-del-ejercito",
        ["correspondences", "inscriptions"],
        ["/correspondences", "/inscriptions"]
      ),
      children: [
        {
          label: "Correspondencias",
          key: "correspondences",
          icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "jefatura-de-bienestar-del-ejercito",
            ["correspondences"],
            ["/correspondences"]
          ),
          onClick: () => {
            onNavigateTo("/correspondences");
            onSetIsVisibleDrawer(false);
          },
        },
        {
          label: "Inscripciones",
          key: "inscriptions",
          icon: <FontAwesomeIcon icon={faIdCard} size="lg" />,
          isVisible: existPageAclsInAclsOfUser(
            "jefatura-de-bienestar-del-ejercito",
            ["inscriptions"],
            ["/inscriptions"]
          ),
          children: [
            {
              key: "military-circle",
              label: "Circulo Militar",
              isVisible: existPageAclsInAclsOfUser(
                "jefatura-de-bienestar-del-ejercito",
                ["inscriptions"],
                ["/inscriptions/cmsts"]
              ),
              onClick: () => {
                onNavigateTo("/inscriptions/cmsts");
                onSetIsVisibleDrawer(false);
              },
            },
          ],
        },
      ],
    },
    {
      label: "Servicio de veterinaria y remonta del ejército",
      key: "servicio-de-veterinaria-y-remonta-del-ejercito",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible: existPageAclsInAclsOfUser(
        "servicio-de-veterinaria-y-remonta-del-ejercito",
        ["livestockAndEquines"],
        ["/livestock-and-equines"]
      ),
      children: [
        {
          key: "livestock-and-equines",
          icon: <FontAwesomeIcon icon={faHorse} size="lg" />,
          label: "Ganados e equinos",
          isVisible: existPageAclsInAclsOfUser(
            "servicio-de-veterinaria-y-remonta-del-ejercito",
            ["livestockAndEquines"],
            ["/livestock-and-equines"]
          ),
          onClick: () => {
            onNavigateTo(
              "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines"
            );
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
