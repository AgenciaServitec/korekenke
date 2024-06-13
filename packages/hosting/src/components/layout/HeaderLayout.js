import React, { cloneElement, useState } from "react";
import { Layout, Space, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowsRotate,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { ImgNoFound, LogoPrimary, PhotoNoFound } from "../../images";
import { mediaQuery } from "../../styles";
import { capitalize, orderBy } from "lodash";
import { Divider, Dropdown } from "../ui";
import { Link } from "react-router-dom";
import { pathnameWithCommand } from "../../utils";

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
  const [isVisibleMoreCommands, setIsVisibleMoreCommands] = useState(false);

  const onSetIsVisibleMoreCommands = () =>
    setIsVisibleMoreCommands(!isVisibleMoreCommands);

  const lastCommand = orderBy(
    (user?.commands || []).filter(
      (command) => command.id !== user.initialCommand.id
    ),
    "name",
    "asc"
  )?.[0];

  const items = [
    {
      label: (
        <Link
          to={pathnameWithCommand(currentCommand.id, "/profile")}
          style={{ color: "#000" }}
        >
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
        <Space align="center" size="large">
          <div>
            <img
              src={LogoPrimary}
              width={40}
              alt="Korekenke"
              onClick={() =>
                onNavigateTo(pathnameWithCommand(currentCommand.id, "/home"))
              }
              className="logo-img"
            />
          </div>
          <div
            style={{ fontSize: "1.7em", display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
              className="icon-item"
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
                              <strong>{currentCommand?.name}</strong>
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
                                src={ImgNoFound}
                                alt="Commando seleccionado"
                              />
                            </div>
                            <div className="text-command">
                              <strong>{lastCommand.name}</strong>
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
                            {user.commands.map((command, index) => (
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
          <Space key="user-avatar" align="center">
            <h4>{capitalize((user?.firstName || "").split(" ")[0] || "")}</h4>
            <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
              ({currentCommand?.code})
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
  display: grid;
  gap: 1em;
  padding: 1em;
  width: 100%;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  .wrapper-default-commands {
    width: 100%;
    border-radius: 1em;
    background: aliceblue;
    padding: 0.5em 0.1em;
    display: flex;
    justify-content: space-between;
    gap: 1em;

    .item-command {
      width: 4em;
      cursor: pointer;
    }

    .selected-command {
      display: grid;
      place-items: center;

      img {
        width: 2.2em;
        height: 2.2em;
        border-radius: 50%;
      }

      .text-command {
        line-height: 1;
        text-align: center;
        font-size: 0.6em;
      }
    }

    .last-command {
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

      .text-command {
        line-height: 1;
        text-align: center;
        font-size: 0.6em;
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
        place-items: center;
        gap: 0.5em;
        cursor: pointer;
        padding: 0.3em;
        border-radius: 0.4em;
        width: 5em;
        background-color: red;

        &:hover {
          background: #c3ddf6;
        }

        img {
          width: 2em;
          height: 2em;
          border-radius: 50%;
        }

        .text-command {
          line-height: 1;
          text-align: center;
          font-size: 0.6em;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          span:last-child {
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
    .logo-img,
    .icon-item {
      cursor: pointer;
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
