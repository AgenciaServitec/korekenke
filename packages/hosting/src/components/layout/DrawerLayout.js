import React from "react";
import { Drawer, Menu } from "../../components";
import styled from "styled-components";
import { version } from "../../firebase";
import {
  faBriefcase,
  faBuildingUser,
  faClipboardList,
  faComputer,
  faCow,
  faDog,
  faFileAlt,
  faFilePen,
  faGears,
  faHome,
  faHorse,
  faIdCard,
  faList,
  faNetworkWired,
  faPoll,
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
    aclNames = [],
  ) => {
    return subCategories
      .map((subCategory) => {
        if (isEmpty(user?.acls?.[category]?.[subCategory])) return false;

        return user.acls?.[category]?.[subCategory].some((acl) =>
          includes(aclNames, acl),
        );
      })
      .some((acl) => acl);
  };

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
        ["/default-roles-acls", "/manage-acls"],
      ),
      children: [
        {
          label: "Roles con Acls",
          key: "default-roles-acls",
          isVisible: existsAclsInAclsOfUser(
            "accessControl",
            ["defaultRolesAcls"],
            ["/default-roles-acls"],
          ),
          onClick: () => onClickMenu("/default-roles-acls"),
        },
        {
          label: "Administrador Acls",
          key: "manage-acls",
          isVisible: existsAclsInAclsOfUser(
            "accessControl",
            ["manageAcls"],
            ["/manage-acls"],
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
        ["/users", "/entities", "/departments", "/sections", "/offices"],
      ),
      children: [
        {
          label: "Usuarios",
          key: "users",
          icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["users"],
            ["/users"],
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
            ["/entities"],
          ),
          onClick: () => onClickMenu("/entities"),
        },
        {
          label: "Unidades",
          key: "units",
          icon: <FontAwesomeIcon icon={faBuildingUser} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["units"],
            ["/units"],
          ),
          onClick: () => onClickMenu("/units"),
        },
        {
          label: "Departamentos",
          key: "departments",
          icon: <FontAwesomeIcon icon={faBuildingUser} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "administration",
            ["departments"],
            ["/departments"],
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
            ["/sections"],
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
            ["/offices"],
          ),
          onClick: () => onClickMenu("/offices"),
        },
      ],
    },
    {
      label: "Correspondencias",
      key: "files",
      icon: <FontAwesomeIcon icon={faClipboardList} size="lg" />,
      isVisible: existsAclsInAclsOfUser(
        "public",
        ["correspondences"],
        ["/correspondences/new", "/correspondences"],
      ),
      children: [
        {
          label: "Realizar correspondencia",
          key: "correspondence",
          icon: <FontAwesomeIcon icon={faFilePen} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "public",
            ["correspondences"],
            ["/correspondences/new"],
          ),
          onClick: () => onClickMenu("/correspondences/new"),
        },
        {
          label: "Lista de correspondencias",
          key: "correspondences-list",
          icon: <FontAwesomeIcon icon={faList} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "public",
            ["correspondences"],
            ["/correspondences"],
          ),
          onClick: () => onClickMenu("/correspondences"),
        },
      ],
    },
    {
      label: "Encuestas",
      key: "surveys",
      icon: <FontAwesomeIcon icon={faPoll} size="lg" />,
      isVisible: existsAclsInAclsOfUser(
        "public",
        ["survey-organizational-climate-studies"],
        ["/organizational-climate-studies"],
      ),
      children: [
        {
          label: "Estudio del Clima Organizacional",
          key: "organizational-climate-studies",
          icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
          isVisible: true,
          onClick: () => onClickMenu("/surveys/organizational-climate-studies"),
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
          ["inscriptions"],
          ["/inscriptions"],
        ) && currentCommand?.id === "copere",
      children: [
        {
          label: "Inscripciones",
          key: "inscriptions",
          icon: <FontAwesomeIcon icon={faIdCard} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "jefatura-de-bienestar-del-ejercito",
            ["inscriptions"],
            ["/inscriptions"],
          ),
          children: [
            {
              key: "military-circle",
              label: "Circulo Militar",
              isVisible: existsAclsInAclsOfUser(
                "jefatura-de-bienestar-del-ejercito",
                ["inscriptions"],
                ["/inscriptions/cmsts"],
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
          ["animals"],
          ["/animals"],
        ) && currentCommand?.id === "cologe",
      children: [
        {
          key: "equines",
          icon: <FontAwesomeIcon icon={faHorse} size="lg" />,
          label: "Equinos",
          isVisible: existsAclsInAclsOfUser(
            "servicio-de-veterinaria-y-remonta-del-ejercito",
            ["animals"],
            ["/animals"],
          ),
          onClick: () =>
            onClickMenu(
              "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=equine",
            ),
        },
        {
          key: "cattle",
          icon: <FontAwesomeIcon icon={faCow} size="lg" />,
          label: "Ganados",
          isVisible: existsAclsInAclsOfUser(
            "servicio-de-veterinaria-y-remonta-del-ejercito",
            ["animals"],
            ["/animals"],
          ),
          onClick: () =>
            onClickMenu(
              "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=cattle",
            ),
        },
        {
          key: "canines",
          icon: <FontAwesomeIcon icon={faDog} size="lg" />,
          label: "Caninos",
          isVisible: existsAclsInAclsOfUser(
            "servicio-de-veterinaria-y-remonta-del-ejercito",
            ["animals"],
            ["/animals"],
          ),
          onClick: () =>
            onClickMenu(
              "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=canine",
            ),
        },
      ],
    },
    {
      label: "Departamento de apoyo social (DAS)",
      key: "departamento-de-apoyo-social",
      icon: <FontAwesomeIcon icon={faShield} size="lg" />,
      isVisible: existsAclsInAclsOfUser(
        "departamento-de-apoyo-social",
        ["dasRequests"],
        ["/das-requests", "/das-requests/new"],
      ),
      children: [
        {
          label: "Realizar Solicitud",
          key: "application-request",
          icon: <FontAwesomeIcon icon={faFilePen} size="lg" />,
          isVisible: existsAclsInAclsOfUser(
            "departamento-de-apoyo-social",
            ["dasRequests"],
            ["/das-requests/new"],
          ),
          onClick: () =>
            onClickMenu(
              "/entities/departamento-de-apoyo-social/das-requests/new",
            ),
        },
        {
          key: "requests-list",
          icon: <FontAwesomeIcon icon={faList} size="lg" />,
          label: "Lista de solicitudes",
          isVisible: existsAclsInAclsOfUser(
            "departamento-de-apoyo-social",
            ["dasRequests"],
            ["/das-requests"],
          ),
          onClick: () =>
            onClickMenu("/entities/departamento-de-apoyo-social/das-requests"),
        },
      ],
    },
  ];

  const filterByRoleCode = (items) => {
    return items.filter((item) => {
      if (item?.children) {
        item.children = (item?.children || []).filter(
          (_children) => _children.isVisible,
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
