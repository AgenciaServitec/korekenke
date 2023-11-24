import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Icon } from "./Icon";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const AddButton = ({ title, margin, onClick }) => {
  return (
    <Container type="primary" opacity="1" margin={margin} onClick={onClick}>
      <div className="content-btn-add">
        <Icon icon={faPlus} fontSize="1.5rem" margin="0 .8rem 0 0" />
        <span className="item-text">
          <div>Agregar {title}</div>
        </span>
      </div>
    </Container>
  );
};

const Container = styled(Button)`
  min-width: 120px;
  width: auto;
  height: auto;
  margin: ${({ margin = "0 0 1.5rem 0" }) => margin};
  padding: 0.5rem 1rem;
  text-transform: uppercase;

  .content-btn-add {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    text-align: center;
    .icon-item {
      margin-right: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin: 0;
      }
    }
    .item-text {
      white-space: normal;
      font-size: 16px;
      font-weight: 400;
      text-transform: uppercase;
      text-shadow: none;
    }
  }
`;
