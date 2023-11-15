import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { tint } from "polished";
import Tooltip from "antd/lib/tooltip";

export const IconAction = ({
  icon,
  tooltipTitle,
  size = 38,
  styled = {},
  onClick,
  ...props
}) => (
  <Tooltip placement="top" title={tooltipTitle}>
    <IconWrapper onClick={onClick} size={size} styled={styled} {...props}>
      <FontAwesomeIcon icon={icon} />
    </IconWrapper>
  </Tooltip>
);

const IconWrapper = styled.div`
  ${({ theme, size, onClick, styled: { color = () => "#142b41" } }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.border_radius.percentage_medium};
    height: ${size}px;
    width: ${size}px;
    color: ${color(theme)};

    ${onClick &&
    css`
      cursor: pointer;

      &:hover {
        border-radius: ${theme.border_radius.percentage_full};
        background: ${tint(0.87, color(theme))};
      }
    `}
    .svg-inline--fa {
      height: ${onClick ? size * 0.55 : size}px;
      width: ${onClick ? size * 0.55 : size}px;
    }
  `}
`;
