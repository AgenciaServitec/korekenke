import React from "react";
import styled, { css } from "styled-components";
import { capitalize, isEmpty, startCase, toString } from "lodash";
import { classNames, keyframes } from "../../../styles";
import Typography from "antd/lib/typography";
import { lighten } from "polished";

const { Text } = Typography;

export const Outlined = ({
  value,
  required,
  error,
  hidden = false,
  label,
  children,
  componentId,
  helperText,
  disabled = false,
}) => (
  <Container
    error={error}
    required={required}
    disabled={disabled}
    hidden={hidden}
  >
    <label htmlFor={componentId} className="item-label">
      {label}
    </label>
    <Wrapper
      value={typeof value === "object" ? !isEmpty(value) : !!toString(value)}
      error={error}
      className={classNames({ "scroll-error-anchor": error })}
      disabled={disabled}
    >
      <div className="item-wrapper">{children}</div>
    </Wrapper>
    {helperText && (
      <Error error={error}>{capitalize(startCase(helperText))}</Error>
    )}
  </Container>
);

const Container = styled.div`
  ${({ theme, error, required, disabled, hidden }) => css`
    width: 100%;

    .item-label,
    .item-label:after {
      color: ${error
        ? theme.colors.error
        : disabled
          ? theme.colors.gray
          : lighten(0.1, theme.colors.font1)};
    }

    .item-label {
      margin-bottom: 0.3em;
      z-index: 100;
      pointer-events: none;
      display: flex;
      align-items: center;
      background-color: transparent;
      color: ${error ? theme.colors.error : theme.colors.body};
      font-size: ${theme.font_sizes.small};
      transition:
        all ease-in-out 150ms,
        opacity 150ms;

      ${hidden &&
      css`
        display: none;
      `};

      ${required &&
      css`
        &:after {
          display: inline-block;
          margin-left: 0.2rem;
          color: ${error ? theme.colors.error : theme.colors.body};
          font-size: ${theme.font_sizes.small};
          line-height: 1;
          content: "*";
        }
      `};
    }
  `};
`;

const Wrapper = styled.div`
  ${({ theme, error, disabled, value }) => css`
    position: relative;
    width: inherit;
    border-radius: ${theme.border_radius.xx_small};
    background: ${disabled ? theme.colors.light : theme.colors.white};
    border: 1px solid ${error ? theme.colors.error : theme.colors.gray};
    animation: ${error && keyframes.shake} 340ms
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;

    &:hover,
    &:focus-within {
      border-color: ${error
        ? theme.colors.error
        : disabled
          ? theme.colors.gray
          : lighten(0.1, theme.colors.primary)};
    }

    .item-wrapper {
      input:-webkit-autofill {
        -webkit-text-fill-color: #fff;
        ${value &&
        css`
          -webkit-text-fill-color: ${({ theme }) => theme.colors.font1};
        `};

        &:focus {
          -webkit-text-fill-color: ${({ theme }) => theme.colors.font1};
        }
      }

      //Styles default
      .ant-input-number,
      .ant-picker,
      .ant-select {
        width: 100%;
        box-shadow: none;
        outline: none;
      }

      .ant-input-affix-wrapper,
      .ant-input {
        box-shadow: none;
      }

      .ant-input-group-addon {
        border: 0 solid #d9d9d9;
        border-left: 1px solid #d9d9d9;
      }
    }
  `}
`;

const Error = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.font_sizes.x_small};
  ${({ error }) =>
    error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `};
`;
