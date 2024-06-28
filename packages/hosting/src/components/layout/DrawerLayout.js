import React from "react";
import { Drawer, Menu } from "../../components";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faBriefcase,
  faBuildingUser,
  faComputer,
  faFileAlt,
  faFileShield,
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
  currentCommand,
  onNavigateTo,
}) => {
  const existsAclsInAclsOfUser = (
    category,
    subCategories = [],
    aclNames = []
  ) =>
    subCategories
      .map((subCategory) => {
        if (isEmpty(user.acls?.[category]?.[subCategory])) return false;

        return user.acls?.[category]?.[subCategory].some((acl) =>
          includes(aclNames, acl)
        );
      })
      .some((acl) => acl);

  const onClickMenu = (pathname) => {
    onSetIsVisibleDrawer(false);
    onNavigateTo(pathname);
  };

  const onClickHome = () => {
    onSetIsVisibleDrawer(false);
    onNavigateTo("/home");
  };

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      isVisible: existsAclsInAclsOfUser("default", ["home"], ["/home"]),
      onClick: () => onClickHome(),
    },
    {
      label: "Control de Accesos (acls)",
      key: "group-acls",
      icon: <FontAwesomeIcon icon={faUsersCog} size="lg" />,
      isVisible: existsAclsInAclsOfUser(
        "accessControl",
        ["defaultRolesAcls", "manageAcls"],
        ["/default-roles-acls", "/manage-acls"]
      ),
      children: [
        {
          label: "Roles con Acls",
          key: "default-roles-acls",
          isVisible: existsAclsInAclsOfUser(
            "accessControl",
            ["defaultRolesAcls"],
            ["/default-roles-acls"]
          ),
          onClick: () => onClickMenu("/default-roles-acls"),
        },
        {
          label: "Administrador Acls",
          key: "manage-acls",
          isVisible: existsAclsInAclsOfUser(
            "accessControl",
            ["manageAcls"],
            ["/manage-acls"]
          ),
          onClick: () => onClickMenu("/manage-acls"),
        },
      ],
    },
    {
      label: "Administración",
      key: "manager",
      icon: <FontAwesomeIcon icon={faGears} size="lg" />,
      isVisible: existsAclsInAclsOfUser(
        "administration",
        ["users", "entities", "departments", "offices", "sections"],
        ["/users", "/entities", "/departments", "/sections", "/offices"]
      ),
      children: [
        {
          label: "Usuarios",
          key: "users",
          icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["users"],
            ["/users"]
          ),
          onClick: () => onClickMenu("/users"),
        },
        {
          label: "Entidades",
          key: "entities",
          icon: <FontAwesomeIcon icon={faNetworkWired} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["entities"],
            ["/entities"]
          ),
          onClick: () => onClickMenu("/entities"),
        },
        {
          label: "Departamentos",
          key: "departments",
          icon: <FontAwesomeIcon icon={faBuildingUser} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["departments"],
            ["/departments"]
          ),
          onClick: () => onClickMenu("/departments"),
        },
        {
          label: "Secciones",
          key: "sections",
          icon: <FontAwesomeIcon icon={faComputer} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["sections"],
            ["/sections"]
          ),
          onClick: () => onClickMenu("/sections"),
        },
        {
          label: "Oficinas",
          key: "offices",
          icon: <FontAwesomeIcon icon={faBriefcase} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["offices"],
            ["/offices"]
          ),
          onClick: () => onClickMenu("/offices"),
        },
      ],
    },
    {
      label: "Jefatura de bienestar del ejército (COBIENE)",
      key: "jefatura-de-bienestar-del-ejercito",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible:
        existsAclsInAclsOfUser(
          "jefatura-de-bienestar-del-ejercito",
          ["correspondences", "inscriptions"],
          ["/correspondences", "/inscriptions"]
        ) && currentCommand?.id === "copere",
      children: [
        {
          label: "Correspondencias",
          key: "correspondences",
          icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "jefatura-de-bienestar-del-ejercito",
            ["correspondences"],
            ["/correspondences"]
          ),
          onClick: () => onClickMenu("/correspondences"),
        },
        {
          label: "Inscripciones",
          key: "inscriptions",
          icon: <FontAwesomeIcon icon={faIdCard} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "jefatura-de-bienestar-del-ejercito",
            ["inscriptions"],
            ["/inscriptions"]
          ),
          children: [
            {
              key: "military-circle",
              label: "Circulo Militar",
              isVisible: existsAclsInAclsOfUser(
                "jefatura-de-bienestar-del-ejercito",
                ["inscriptions"],
                ["/inscriptions/cmsts"]
              ),
              onClick: () => onClickMenu("/inscriptions/cmsts"),
            },
          ],
        },
      ],
    },
    {
      label: "Servicio de veterinaria y remonta del ejército",
      key: "servicio-de-veterinaria-y-remonta-del-ejercito",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible:
        existsAclsInAclsOfUser(
          "servicio-de-veterinaria-y-remonta-del-ejercito",
          ["livestockAndEquines"],
          ["/livestock-and-equines"]
        ) && currentCommand?.id === "cologe",
      children: [
        {
          key: "livestock-and-equines",
          icon: <FontAwesomeIcon icon={faHorse} size="lg" />,
          label: "Ganados y equinos",
          isVisible: existsAclsInAclsOfUser(
            "servicio-de-veterinaria-y-remonta-del-ejercito",
            ["livestockAndEquines"],
            ["/livestock-and-equines"]
          ),
          onClick: () =>
            onClickMenu(
              "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines"
            ),
        },
      ],
    },
    {
      label: "Departamento de apoyo social",
      key: "departamento-de-apoyo-social",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible: true,
      children: [
        {
          key: "requests-list",
          icon: <FontAwesomeIcon icon={faFileShield} size="lg" />,
          label: "Lista de solicitudes",
          isVisible: true,
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
