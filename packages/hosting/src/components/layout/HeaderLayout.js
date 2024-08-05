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
import { userFullName } from "../../utils";
import { useGlobalData } from "../../providers";

const { Header } = Layout;
const { useToken } = theme;

export const HeaderLayout = ({
  user,
  isVisibleDrawer,
  setIsVisibleDrawer,
  openDropdown,
  onOpenDropdown,
  onNavigateTo,
  onChangeDefaultCommand,
  currentCommand,
  onLogout,
}) => {
  const { token } = useToken();
  const { rolesAcls } = useGlobalData();

  const [isVisibleMoreCommands, setIsVisibleMoreCommands] = useState(false);

  const onSetIsVisibleMoreCommands = () =>
    setIsVisibleMoreCommands(!isVisibleMoreCommands);

  const lastCommand = orderBy(
    (user?.commands || []).filter(
      (command) => command?.id !== user?.initialCommand?.id,
    ),
    "updateAt",
    "desc",
  )?.[0];

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
      <div className="right-item">
        <Space align="center" className="items-wrapper">
          <div
            style={{ fontSize: "1.7em", display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
              className="icon-item"
            />
          </div>
          <div>
            <img
              src={currentCommand?.logoImgUrl || LogoPrimary}
              width={40}
              alt="Korekenke"
              onClick={() => onNavigateTo("/home")}
              className="logo-img"
            />
          </div>
          <div onClick={() => onNavigateTo("/home")}>
            <h3
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                margin: "0",
              }}
            >
              {currentCommand?.code}
            </h3>
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
              {lastCommand && (
                <>
                  <ItemDefaultCommand>
                    {!isVisibleMoreCommands ? (
                      <>
                        <div className="wrapper-default-commands">
                          <div className="selected-command item-command">
                            <img
                              src={user?.profilePhoto?.thumbUrl || PhotoNoFound}
                              alt="Comando seleccionado"
                            />
                            <div className="text-command">
                              <span>
                                <strong>{currentCommand?.name}</strong>
                              </span>
                              <span>
                                <strong>{currentCommand?.code}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="last-command item-command">
                            <div
                              className="item-img"
                              onClick={() =>
                                onChangeDefaultCommand(lastCommand)
                              }
                            >
                              <FontAwesomeIcon
                                icon={faArrowsRotate}
                                type="light"
                                className="icon-rotate"
                              />
                              <img
                                src={lastCommand.logoImgUrl}
                                alt="Commando seleccionado"
                              />
                            </div>
                            <div className="text-command">
                              <span>
                                <strong>{lastCommand.name}</strong>
                              </span>
                              <span>
                                <strong>{lastCommand.code}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="item-show-more-commands">
                          <span
                            onClick={() => onSetIsVisibleMoreCommands(false)}
                          >
                            Ver todos los commandos
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="wrapper-go-back">
                          <span onClick={() => onSetIsVisibleMoreCommands()}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
                          </span>
                        </div>
                        <div className="wrapper-more-commands">
                          <ul>
                            {(
                              orderBy(user?.commands, "updateAt", "desc") || []
                            ).map((command, index) => (
                              <li
                                key={index}
                                className="item-command"
                                onClick={() => {
                                  onChangeDefaultCommand(command);
                                  onSetIsVisibleMoreCommands();
                                }}
                              >
                                <img
                                  src={command.logoImgUrl}
                                  alt="Comando seleccionado"
                                />
                                <div className="text-command">
                                  <span>
                                    <strong>{command.name}</strong>
                                  </span>
                                  <span>
                                    <strong>{command.code}</strong>
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </ItemDefaultCommand>
                  <Divider
                    style={{
                      margin: 0,
                    }}
                  />
                </>
              )}
              {cloneElement(menu, {
                style: {
                  boxShadow: "none",
                },
              })}
            </div>
          )}
        >
          <Space key="user-avatar" align="center" style={{ lineHeight: "1em" }}>
            <span>
              <h4 className="capitalize">
                {capitalize(userFullName(user) || "")}
              </h4>
              <span className="capitalize">
                (
                {rolesAcls.find((roleAcl) => roleAcl.id === user.roleCode)
                  ?.name || ""}
                )
              </span>
            </span>
            <img
              src={user?.profilePhoto?.thumbUrl || PhotoNoFound}
              alt="user"
            />
          </Space>
        </Dropdown>
      </div>
    </HeaderContainer>
  );
};

const ItemDefaultCommand = styled.div`
  width: 23.8em;
  display: grid;
  gap: 1em;
  padding: 1em;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  .wrapper-default-commands {
    width: 100%;
    border-radius: 1em;
    background: aliceblue;
    padding: 0.5em;
    display: flex;
    justify-content: space-between;
    gap: 1em;

    .item-command {
      width: 5em;
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: 0.5em;
      cursor: pointer;
    }

    .selected-command {
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: 0.5em;

      img {
        place-self: center;
        width: 2.2em;
        height: 2.2em;
        border-radius: 50%;
      }

      .text-command {
        display: grid;
        grid-template-rows: 1fr 1em;
        gap: 0.5em;
        line-height: 1;
        text-align: center;
        font-size: 0.45em;
        span:last-child {
          font-size: 1.2em;
          text-transform: uppercase;
        }
      }
    }

    .last-command {
      display: grid;
      grid-template-rows: 1fr 1fr;

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

      .text-command {
        display: grid;
        grid-template-rows: 1fr 1em;
        line-height: 1;
        text-align: center;
        font-size: 0.45em;
        span:last-child {
          font-size: 1.2em;
          text-transform: uppercase;
        }
      }
    }
  }

  .item-show-more-commands {
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
  .wrapper-more-commands {
    ul {
      list-style: none;
      margin: 0;
      display: flex;
      justify-content: center;
      gap: 0.4em;

      .item-command {
        display: grid;
        grid-template-rows: 1fr 1fr;
        gap: 0.5em;
        cursor: pointer;
        padding: 0.2em;
        border-radius: 0.4em;
        width: 5em;

        &:hover {
          background: #c3ddf6;
        }

        img {
          width: 2.2em;
          height: 2.2em;
          border-radius: 50%;
          place-self: center;
        }

        .text-command {
          display: grid;
          grid-template-rows: 1fr 1em;
          line-height: 1;
          text-align: center;
          font-size: 0.45em;
          gap: 0.5em;
          span:last-child {
            font-size: 1.2em;
            text-transform: uppercase;
          }
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

  .right-item {
    display: flex;
    align-items: center;

    .items-wrapper {
      .logo-img,
      .icon-item {
        cursor: pointer;
      }
      .icon-item {
        margin-right: 1em;
      }
    }
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
