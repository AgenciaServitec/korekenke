import React, { cloneElement, useState } from "react";
import { Layout, Space, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowsRotate,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { LogoPrimary, PhotoNoFound } from "../../images";
import { mediaQuery } from "../../styles";
import { capitalize, orderBy } from "lodash";
import { Divider, Dropdown } from "../ui";
import { Link } from "react-router-dom";
import { allRoles } from "../../data-list/roles";

const { Header } = Layout;
const { useToken } = theme;

export const HeaderLayout = ({
  user,
  isVisibleDrawer,
  setIsVisibleDrawer,
  openDropdown,
  onOpenDropdown,
  onNavigateTo,
  onChangeDefaultRole,
  onLogout,
}) => {
  const { token } = useToken();
  const [isVisibleMoreRoles, setIsVisibleMoreRoles] = useState(false);

  const onSetIsVisibleMoreRoles = () =>
    setIsVisibleMoreRoles(!isVisibleMoreRoles);

  const defaultRole = allRoles.find(
    (role) => role?.code === user?.defaultRoleCode
  );

  const lastRole = orderBy(
    user.otherRoles.filter((role) => role.code !== defaultRole.code),
    "updateAt",
    "desc"
  )[0];

  const items = [
    {
      label: (
        <Link to="/profile" style={{ color: "#000" }}>
          <div style={{ padding: ".4em 0" }}>Perfil</div>
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <div
          onClick={() => onLogout()}
          style={{ padding: ".4em 0", color: "red" }}
        >
          Cerrar sesion
        </div>
      ),
      key: "3",
    },
  ];

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <HeaderContainer>
      <div className="item-logo" onClick={() => onNavigateTo("/home")}>
        <Space align="center" size="large">
          <div>
            <img src={LogoPrimary} width={40} alt="Korekenke" />
          </div>
          <div
            style={{ fontSize: "1.7em", display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
            />
          </div>
        </Space>
      </div>
      <div className="user-items">
        <Dropdown
          trigger={["click"]}
          menu={{ items }}
          open={openDropdown}
          onOpenChange={onOpenDropdown}
          dropdownRender={(menu) => (
            <div style={contentStyle}>
              <ItemDefaultRole>
                {!isVisibleMoreRoles ? (
                  <>
                    <div className="wrapper-default-roles">
                      <div className="selected-role item-role">
                        <img
                          src={user?.profileImage?.thumbUrl || PhotoNoFound}
                          alt="Role seleccionado"
                        />
                        <div className="text-role">
                          <strong>{defaultRole.name}</strong>
                        </div>
                      </div>
                      <div className="last-role item-role">
                        <div
                          className="item-img"
                          onClick={() => onChangeDefaultRole(lastRole)}
                        >
                          <FontAwesomeIcon
                            icon={faArrowsRotate}
                            type="light"
                            className="icon-rotate"
                          />
                          <img src={lastRole.imgUrl} alt="Role seleccionado" />
                        </div>
                        <div className="text-role">
                          <strong>{lastRole.name}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="item-show-more-roles">
                      <span onClick={() => onSetIsVisibleMoreRoles(false)}>
                        Ver todos los roles
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="wrapper-go-back">
                      <span onClick={() => onSetIsVisibleMoreRoles()}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Regresar
                      </span>
                    </div>
                    <div className="wrapper-more-roles">
                      <ul>
                        {user.otherRoles.map((role, index) => (
                          <li
                            key={index}
                            className="item-role"
                            onClick={() => {
                              onSetIsVisibleMoreRoles();
                              return onChangeDefaultRole(role);
                            }}
                          >
                            <img src={role.imgUrl} alt="Role seleccionado" />
                            <div className="text-role">
                              <strong>{role.name}</strong>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </ItemDefaultRole>
              <Divider
                style={{
                  margin: 0,
                }}
              />
              {cloneElement(menu, {
                style: {
                  boxShadow: "none",
                },
              })}
            </div>
          )}
        >
          <Space key="user-avatar" align="center">
            <h4>{capitalize((user?.firstName || "").split(" ")[0] || "")}</h4>
            <span>({defaultRole.name})</span>
            <img
              src={user?.profileImage?.thumbUrl || PhotoNoFound}
              alt="user"
            />
          </Space>
        </Dropdown>
      </div>
    </HeaderContainer>
  );
};

const ItemDefaultRole = styled.div`
  display: grid;
  gap: 1em;
  padding: 1em;
  width: 20em;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  .wrapper-default-roles {
    width: 100%;
    border-radius: 1em;
    background: aliceblue;
    padding: 0.5em 0.1em;
    display: flex;
    justify-content: space-between;
    gap: 1em;

    .item-role {
      width: 4em;
      cursor: pointer;
    }

    .selected-role {
      display: grid;
      place-items: center;

      img {
        width: 2.2em;
        height: 2.2em;
        border-radius: 50%;
      }

      .text-role {
        line-height: 1;
        text-align: center;
        font-size: 0.6em;
      }
    }

    .last-role {
      display: grid;
      place-items: center;

      .item-img {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-rotate {
          position: absolute;
          font-size: 2.2em;
          z-index: 200;
          animation: spin 10s linear infinite;
        }

        img {
          width: 1.5em;
          height: 1.5em;
          border-radius: 50%;
          z-index: 300;
        }
      }

      .text-role {
        line-height: 1;
        text-align: center;
        font-size: 0.6em;
      }
    }
  }

  .item-show-more-roles {
    color: dodgerblue;
    span {
      cursor: pointer;
    }
  }

  .wrapper-go-back {
    color: dodgerblue;
    span {
      cursor: pointer;
    }
  }
  .wrapper-more-roles {
    ul {
      list-style: none;
      margin: 0;
      display: flex;
      justify-content: center;
      gap: 0.4em;

      .item-role {
        display: grid;
        place-items: center;
        gap: 0.5em;
        cursor: pointer;
        padding: 0.3em;
        border-radius: 0.4em;
        width: 4.2em;

        &:hover {
          background: #c3ddf6;
        }

        img {
          width: 1.7em;
          height: 1.7em;
          border-radius: 50%;
        }

        .text-role {
          line-height: 1;
          text-align: center;
          font-size: 0.6em;
        }
      }
    }
  }
`;

const HeaderContainer = styled(Header)`
  background: #fff !important;
  position: sticky;
  top: 1px;
  z-index: 1000;
  display: grid;
  grid-template-columns: auto 1fr;
  box-shadow: 0 1px 4px rgba(105, 105, 105, 0.24);
  overflow: hidden;
  padding: 0 16px;

  .item-logo {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-items {
    display: flex;
    align-items: center;
    justify-content: end;

    h4 {
      margin: 0;
      font-size: 0.8em;

      ${mediaQuery.minTablet} {
        font-size: 1em;
      }
    }

    img {
      width: 2em;
      height: 2em;
      border-radius: 50%;
      margin: auto;
      object-fit: cover;
      cursor: pointer;

      ${mediaQuery.minTablet} {
        width: 2.5em;
        height: 2.5em;
      }
    }
  }
`;
