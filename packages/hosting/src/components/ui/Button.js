import React from "react";
import styled, { css } from "styled-components";
import { tint } from "polished";
import ButtonAntd from "antd/lib/button";

export const Button = ({
  children,
  disabled,
  loading,
  onClick,
  htmlType,
  block,
  type,
  size,
  icon,
  className,
  styled,
  danger,
  ghost,
}) => (
  <ButtonStyled
    danger={danger}
    styled={styled}
    type={type}
    className={className}
    icon={icon}
    size={size}
    block={block}
    htmlType={htmlType}
    disabled={disabled}
    loading={loading}
    onClick={onClick}
    ghost={ghost}
  >
    {children}
  </ButtonStyled>
);

const ButtonStyled = styled(ButtonAntd)`
  text-transform: uppercase;

  ${({ theme, styled: { background, color = () => "white" } = {} }) =>
  background &&
  css`
      color: ${color(theme)};
      background: ${background(theme)};
      border-color: ${background(theme)};

      &:hover,
      &:focus {
        color: ${color(theme)};
        background: ${tint(0.25, background(theme))};
        border-color: ${tint(0.25, background(theme))};
      }
    `}
`;
