import React from "react";
import { Layout } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { AvatarNoFound, LogoPrimary } from "../../images";
import { mediaQuery } from "../../styles";
import Space from "antd/lib/space";
import { capitalize } from "lodash";

const { Header } = Layout;

export const HeaderLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  user,
  onNavigateTo,
}) => {
  return (
    <HeaderContainer>
      <div className="item-logo" onClick={() => onNavigateTo("/products")}>
        <Space align="center">
          <img src={LogoPrimary} width={65} alt="Vida - tiendas organicas" />
        </Space>
      </div>
      <div className="user-items">
        {user ? (
          <Space align="center">
            <h4>{capitalize((user?.firstName || "").split(" ")[0] || "")}</h4>
            <img
              onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
              src={user?.profileImage?.thumbUrl || AvatarNoFound}
              alt="user"
            />
          </Space>
        ) : (
          <Space
            align="center"
            onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
          >
            <span>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </span>
          </Space>
        )}
      </div>
    </HeaderContainer>
  );
};

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

    .trigger {
      padding: 0 1em;
      cursor: pointer;
      font-size: 18px;
      line-height: 64px;
      transition: color 0.3s;
    }

    .trigger:hover {
      color: #1890ff;
    }
  }
`;
